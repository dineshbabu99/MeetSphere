const Ticket =
  require("../models/Ticket");

const Event =
  require("../models/Event");

const User =
  require("../models/User");

const purchaseTicket =
  async (req, res) => {

    try {

      const tickets =
        req.body;

      if (
        !Array.isArray(
          tickets
        ) ||

        tickets.length === 0
      ) {

        return res
          .status(400)
          .json({
            message:
              "No tickets provided",
          });
      }

      // Validate ticket availability
      for (const purchasedTicket of tickets) {

        const event =
          await Event.findById(
            purchasedTicket.eventId
          );

        if (!event) {

          return res
            .status(404)
            .json({
              message:
                "Event not found",
            });
        }

        const ticketType =
          event.tickets.find(
            (ticket) =>
              ticket.name ===
              purchasedTicket.ticketType
          );

        if (!ticketType) {

          return res
            .status(404)
            .json({
              message:
                "Ticket type not found",
            });
        }

        const remaining =
          ticketType.capacity -
          (ticketType.sold || 0);

        if (
          purchasedTicket.quantity >
          remaining
        ) {

          return res
            .status(400)
            .json({
              message:
                `${ticketType.name} tickets sold out`,
            });
        }
      }

      // Create tickets
      const createdTickets =
        await Ticket.insertMany(
          tickets
        );

      // Update event counts
      for (const purchasedTicket of tickets) {

        const event =
          await Event.findById(
            purchasedTicket.eventId
          );

        const ticketType =
          event.tickets.find(
            (ticket) =>
              ticket.name ===
              purchasedTicket.ticketType
          );

        // Update ticket type sold
        ticketType.sold =
          (ticketType.sold || 0) +
          purchasedTicket.quantity;

        // Update total sold
        event.sold =
          (event.sold || 0) +
          purchasedTicket.quantity;

        await event.save();
      }

      res.status(201).json({

        message:
          "Tickets purchased successfully",

        tickets:
          createdTickets,
      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
};
const getTickets =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const tickets =
        await Ticket.find({
          userId,
          status: "Active",
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(
        tickets
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
};

const getAllTickets =
  async (req, res) => {

    try {

      const tickets =
        await Ticket.find({
          status: "Active",
        }).sort({
          createdAt: -1,
        });

      const userIds =
        tickets.map(
          (ticket) =>
            ticket.userId
        );

      const users =
        await User.find({
          _id: {
            $in: userIds,
          },
        }).select("name email");

      const userMap =
        users.reduce(
          (map, user) => {
            map[user._id.toString()] =
              user;

            return map;
          },
          {}
        );

      const enrichedTickets =
        tickets.map((ticket) => {

          const user =
            userMap[ticket.userId];

          return {
            ...ticket.toObject(),
            userName:
              user?.name ||
              "Unknown User",
            userEmail:
              user?.email ||
              "No email",
          };
        });

      res.status(200).json(
        enrichedTickets
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const updateAttendanceStatus =
  async (req, res) => {

    try {

      const {
        attendanceStatus,
      } = req.body;

      if (
        ![
          "Booked",
          "Attended",
          "Not Arrived",
        ].includes(attendanceStatus)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid attendance status",
          });
      }

      const ticket =
        await Ticket.findByIdAndUpdate(
          req.params.id,
          {
            attendanceStatus,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!ticket) {

        return res
          .status(404)
          .json({
            message:
              "Ticket not found",
          });
      }

      res.status(200).json({
        message:
          "Attendance updated",
        ticket,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const deleteTicket =
  async (req, res) => {

    try {

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      if (!ticket) {

        return res
          .status(404)
          .json({
            message:
              "Ticket not found",
          });
      }

      // Find event
      const event =
        await Event.findById(
          ticket.eventId
        );

      if (event) {

        // Find ticket type
        const ticketType =
          event.tickets.find(
            (item) =>
              item.name ===
              ticket.ticketType
          );

        // Reduce sold count
        if (ticketType) {

          ticketType.sold =
            Math.max(
              0,
              (ticketType.sold || 0) -
                ticket.quantity
            );
        }

        // Reduce total sold
        event.sold =
          Math.max(
            0,
            (event.sold || 0) -
              ticket.quantity
          );

        await event.save();
      }

      ticket.status =
  "Cancelled";

await ticket.save();

      res.status(200).json({

        message:
          "Ticket cancelled successfully",
      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
};

module.exports = {

  purchaseTicket,

  getTickets,

  getAllTickets,

  updateAttendanceStatus,

  deleteTicket,
};
