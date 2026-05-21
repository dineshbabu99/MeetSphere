const Event =
  require("../models/Event");



const createEvent =
  async (req, res) => {

    try {
    //   const {eventName,category,date,price,capacity,location,status,} = req.body;



      const event =
        await Event.create( req.body);

      res.status(201).json({
        message:
          "Event created successfully",

        event,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
};


const getEvents =
  async (req, res) => {

    try {

      const events =
        await Event.find();

      res.status(200).json(
        events
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
};

const updateEventStatus =
  async (req, res) => {

    try {

      const {
        status,
      } = req.body;

      if (
        ![
          "Open",
          "Pending",
          "Rejected",
          "Draft",
        ].includes(status)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid event status",
          });
      }

      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!event) {

        return res
          .status(404)
          .json({
            message:
              "Event not found",
          });
      }

      res.status(200).json({
        message:
          "Event status updated",
        event,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


const updateEvent =
  async (req, res) => {

    try {

      const existing =
        await Event.findById(
          req.params.id
        );

      if (!existing) {

        return res
          .status(404)
          .json({
            message:
              "Event not found",
          });
      }

      const updates = {
        ...req.body,
      };

      if (
        updates.tickets &&
        Array.isArray(
          updates.tickets
        )
      ) {

        updates.tickets =
          updates.tickets.map(
            (ticket) => {

              const existingTicket =
                existing.tickets.find(
                  (t) =>
                    (ticket._id &&
                      t._id.toString() ===
                        ticket._id.toString()) ||
                    t.name ===
                      ticket.name
                );

              return {
                ...ticket,
                sold:
                  existingTicket?.sold ??
                  ticket.sold ??
                  0,
              };
            }
          );
      }

      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        message:
          "Event updated successfully",
        event,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


const deleteEvent =
  async (req, res) => {

    try {

      const event =
        await Event.findByIdAndDelete(
          req.params.id
        );

      if (!event) {

        return res
          .status(404)
          .json({
            message:
              "Event not found",
          });
      }

      res.status(200).json({
        message:
          "Event deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


module.exports = {
  createEvent,
  getEvents,
  updateEventStatus,
  updateEvent,
  deleteEvent,
};

