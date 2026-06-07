const crypto = require("crypto");
const Razorpay = require("razorpay");

const Payment = require("../models/Payments");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

let razorpayClient = null;

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env"
    );
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}

// Build ticket rows and update sold counts on the event
async function issueTickets(userId, event, cart) {
  const newTickets = [];

  for (const item of cart) {
    const code = event.title.slice(0, 5).replace(/\s/g, "") + "-" + Date.now();

    const ticket = await Ticket.create({
      ticketId: `${code}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      eventId: event._id.toString(),
      eventName: event.title,
      ticketType: item.ticketType,
      location: event.location,
      date: event.eventDateTime,
      price: item.price,
      quantity: item.quantity,
      purchaseDate: new Date(),
    });

    newTickets.push(ticket);

    const typeOnEvent = event.tickets.find((t) => t.name === item.ticketType);
    typeOnEvent.sold = (typeOnEvent.sold || 0) + item.quantity;
    event.sold = (event.sold || 0) + item.quantity;
  }

  await event.save();
  return newTickets;
}

async function getCartFromRequest(eventId, items) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  if (event.status !== "Open") throw new Error("This event is not open for booking");
  if (!items?.length) throw new Error("Please select at least one ticket");

  let totalRupees = 0;
  const cart = [];

  for (const item of items) {
    const type = event.tickets.find((t) => t.name === item.ticketType);
    if (!type) throw new Error("Unknown ticket type");

    const quantity = Number(item.quantity);
    const seatsLeft = type.capacity - (type.sold || 0);

    if (quantity < 1 || quantity > seatsLeft) {
      throw new Error(`${type.name} is not available in that quantity`);
    }

    totalRupees += type.price * quantity;
    cart.push({
      ticketType: type.name,
      quantity,
      price: type.price,
    });
  }

  return { event, cart, totalRupees };
}

// POST /api/payments/create-order
const createOrder = async (req, res) => {
  try {
    const { eventId, items } = req.body;
    const userId = req.user._id.toString();

    const { event, cart, totalRupees } = await getCartFromRequest(
      eventId,
      items
    );

    const amountPaise = Math.round(totalRupees * 100);

    // Free tickets — skip Razorpay
    if (amountPaise === 0) {
      const tickets = await issueTickets(userId, event, cart);
      return res.json({
        free: true,
        message: "Your free tickets are confirmed",
        tickets,
      });
    }

    const order = await getRazorpay().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `ms_${Date.now()}`,
    });

    await Payment.create({
      userId,
      eventId: event._id.toString(),
      razorpayOrderId: order.id,
      amount: amountPaise,
      currency: "INR",
      status: "Created",
      ticketPayload: cart,
    });

    res.json({
      orderId: order.id,
      amount: amountPaise,
      keyId: process.env.RAZORPAY_KEY_ID || "",
      eventTitle: event.title,
    });
  } catch (err) {
    const configurationError =
      err.message?.includes(
        "Razorpay keys missing"
      );

    res
      .status(
        configurationError
          ? 503
          : 400
      )
      .json({
        message: configurationError
          ? "Online payment is temporarily unavailable. Please contact the administrator."
          : err.message,
      });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    // Razorpay tells us the payment is real
    const signBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment could not be verified" });
    }

    const record = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!record) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (record.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "This order belongs to another user" });
    }

    // Already done — don't create tickets twice
    if (record.status === "Paid") {
      const tickets = await Ticket.find({ _id: { $in: record.ticketIds } });
      return res.json({
        message: "Already confirmed",
        tickets,
      });
    }

    const event = await Event.findById(record.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Seats might have sold out while user was on the payment screen
    for (const item of record.ticketPayload) {
      const type = event.tickets.find((t) => t.name === item.ticketType);
      const seatsLeft = type.capacity - (type.sold || 0);
      if (item.quantity > seatsLeft) {
        record.status = "Failed";
        await record.save();
        return res.status(400).json({ message: `${item.ticketType} just sold out` });
      }
    }

    const tickets = await issueTickets(
      record.userId,
      event,
      record.ticketPayload
    );

    record.status = "Paid";
    record.razorpayPaymentId = razorpay_payment_id;
    record.ticketIds = tickets.map((t) => t._id.toString());
    await record.save();

    res.json({
      message: "Payment successful — enjoy the event!",
      tickets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };
