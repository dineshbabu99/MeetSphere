const Event =
  require("../models/Event");

const isAdmin = (user) =>
  user?.role === "Admin";

const isOrganizer = (user) =>
  user?.role === "Event Organizer";

const isEventOwner = (event, user) =>
  event.organizer &&
  user?._id &&
  event.organizer.toString() ===
    user._id.toString();



const createEvent =
  async (req, res) => {

    try {
    //   const {eventName,category,date,price,capacity,location,status,} = req.body;



      const event =
        await Event.create({
          ...req.body,
          organizer: req.user?._id,
        });

      await event.populate(
        "organizer",
        "name email role"
      );

      res.status(201).json({
        message:
          "Event created successfully",

        event,
      });
const dbEvent = await Event.findById(event._id);

// console.log("After DB Save:", dbEvent);
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

      let filter = {};

      if (isOrganizer(req.user)) {
        filter = {
          organizer: req.user._id,
        };
      }

      const events = await Event.find(filter)
      .populate("organizer", "name email role");

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

      if (
        isOrganizer(req.user) &&
        (
          !isEventOwner(
            existing,
            req.user
          ) ||
          status !== "Pending" ||
          ![
            "Draft",
            "Rejected",
          ].includes(
            existing.status
          )
        )
      ) {

        return res
          .status(403)
          .json({
            message:
              "Organizers can only submit their own events for approval",
          });
      }

      existing.status =
        status;

      await existing.save();
      await existing.populate(
        "organizer",
        "name email role"
      );

      res.status(200).json({
        message:
          "Event status updated",
        event: existing,
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

      if (
        isOrganizer(req.user) &&
        !isEventOwner(existing, req.user)
      ) {

        return res
          .status(403)
          .json({
            message:
              "You can update only your events",
          });
      }

      const updates = {
        ...req.body,
      };

      if (!isAdmin(req.user)) {

        delete updates.status;
        delete updates.organizer;
        delete updates.sold;
      }

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

      await event.populate(
        "organizer",
        "name email role"
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
        await Event.findById(
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

      if (
        isOrganizer(req.user) &&
        !isEventOwner(event, req.user)
      ) {

        return res
          .status(403)
          .json({
            message:
              "You can delete only your events",
          });
      }

      await Event.findByIdAndDelete(
        req.params.id
      );

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

