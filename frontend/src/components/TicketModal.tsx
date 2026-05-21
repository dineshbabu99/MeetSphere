import { useMemo, useState } from "react";

import { useAppDispatch } from "../store/hooks";

import { purchaseTicket } from "../store/slices/ticketSlice";
import { fetchEvents } from "../store/slices/eventSlice";

type TicketModalProps = {
  open: boolean;

  onClose: () => void;

  event: any;
};

export default function TicketModal({
  open,
  onClose,
  event,
}: TicketModalProps) {

  const dispatch =
    useAppDispatch();

    // console.log(event)


  const [qty, setQty] =
    useState<
      Record<string, number>
    >({});



  const changeQty = (
    id: string,
    type: "inc" | "dec"
  ) => {

    setQty((prev) => ({

      ...prev,

      [id]:
        type === "inc"
          ? (prev[id] || 0) + 1
          : Math.max(
              (prev[id] || 0) - 1,
              0
            ),
    }));
  };



  const subtotal =
    useMemo(() => {

      if (!event?.tickets)
        return 0;

      return event.tickets.reduce(
        (
          total: number,
          ticket: any
        ) => {

          return (
            total +

            ticket.price *

              (qty[
                ticket._id ||
                  ticket.id
              ] || 0)
          );
        },

        0
      );
    }, [qty, event]);



  const total = subtotal;



  const isDisabled =
    Object.values(qty).every(
      (value) => value === 0
    );

const user = {
  userInfo: JSON.parse(
    localStorage.getItem("user") ||
      "[]"
  ),
};


const completePurchase =
  async () => {

    const selectedTickets =
      event.tickets
        .filter(
          (ticket: any) =>

            (qty[
              ticket._id ||
              ticket.id
            ] || 0) > 0
        )

     .map((ticket: any) => {

  const eventCode =
    event.title
      .replace(/\s+/g, "")
      .substring(0, 5)
      .toUpperCase();

  const ticketCode =
    ticket.name
      .replace(/\s+/g, "")
      .substring(0, 3)
      .toUpperCase();

  const dateCode =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

  const randomCode =
    Math.floor(
      1000 + Math.random() * 9000
    );

return {
  ticketId: `${eventCode}-${ticketCode}-${dateCode}-${randomCode}`,

  eventId: event._id,

  eventName: event.title,

  userId: user?.userInfo._id,

  ticketType: ticket.name,

  location: event.location,

  date: event.eventDateTime,

  price: ticket.price,

  quantity:
    qty[ticket._id || ticket.id],

  purchaseDate:
    new Date().toISOString(),
};
})


try {
  const response = await dispatch(
    purchaseTicket(selectedTickets)
  ).unwrap();
  
    await dispatch(
    fetchEvents()
  );
  alert(response.message || "🎉 Purchase confirmed!");
} catch (error: any) {
  alert(error.message || "❌ Purchase failed");
}



    setQty({});

    onClose();
  };



  if (!open || !event)
    return null;



  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

      {/* Modal */}
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[var(--bg2)] p-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            {event.title}
          </h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[var(--bg3)] text-gray-400 transition-all hover:border-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="mb-8 h-52 overflow-hidden rounded-2xl">

          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />

        </div>

        {/* Tickets */}
        <div className="space-y-5">

      {event.tickets.map(
  (ticket: any) => {

    const remaining =
      ticket.capacity -
      (ticket.sold || 0);

    const soldOut =
      remaining <= 0;

    return (

      <div
        key={
          ticket._id ||
          ticket.id
        }
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg3)] p-5"
      >

        {/* Left */}
        <div>

          <h3 className="text-lg font-semibold text-white">
            {ticket.name}
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            {remaining} left
          </p>

          {ticket.description && (
            <p className="mt-2 text-sm text-gray-500">
              {ticket.description}
            </p>
          )}

          {soldOut && (
            <p className="mt-1 text-sm text-red-400">
              Sold Out
            </p>
          )}

        </div>

        {/* Right */}
        <div className="text-right">

          <div
            className={`text-2xl font-bold ${
              ticket.name
                .toLowerCase()
                .includes("vip")
                ? "text-yellow-400"
                : "text-[var(--accent)]"
            }`}
          >

            {
              ticket.price === 0
                ? "Free"
                : `₹${ticket.price}`
            }

          </div>

          {/* Quantity */}
          <div className="mt-3 flex items-center justify-end gap-3">

            <button
              onClick={() =>
                changeQty(
                  ticket._id ||
                    ticket.id,

                  "dec"
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg4)] text-white transition-all hover:bg-white/10"
            >
              −
            </button>

            <span className="w-5 text-center font-semibold text-white">

              {
                qty[
                  ticket._id ||
                    ticket.id
                ] || 0
              }

            </span>

            <button
              disabled={
                soldOut ||

                (qty[
                  ticket._id ||
                    ticket.id
                ] || 0) >=
                  remaining
              }

              onClick={() =>
                changeQty(
                  ticket._id ||
                    ticket.id,

                  "inc"
                )
              }

              className={`flex h-9 w-9 items-center justify-center rounded-lg text-white transition-all ${
                soldOut
                  ? "cursor-not-allowed bg-gray-600"
                  : "bg-[var(--accent)] hover:opacity-90"
              }`}
            >
              +
            </button>

          </div>
        </div>
      </div>
    );
  }
)}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10"></div>

        {/* Total */}
        <div className="mb-6 flex items-center justify-between text-lg font-semibold">

          <span>Total</span>

          <span className="text-[var(--accent)]">

            ₹{
              total.toFixed(2)
            }

          </span>
        </div>

        {/* Button */}
        <button
          onClick={completePurchase}

          disabled={isDisabled}

          className={`flex w-full items-center justify-center rounded-xl py-4 text-lg font-semibold text-white transition-all ${
            isDisabled
              ? "cursor-not-allowed bg-gray-600"
              : "bg-[var(--accent)] hover:opacity-90"
          }`}
        >
          🔒 Proceed to Payment
        </button>
      </div>
    </div>
  );
}
