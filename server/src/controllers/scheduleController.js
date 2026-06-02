const Schedule =
  require("../models/Schedule");

const Event =
  require("../models/Event");

const populateEvent =
  {
    path: "event",
    select:
      "title category location eventDateTime image status organizer",
  };

const canManageEvent = (event, user) => {
  if (user?.role === "Admin") {
    return true;
  }

  return (
    user?.role === "Event Organizer" &&
    event.organizer &&
    event.organizer.toString() ===
      user._id.toString()
  );
};

const getSchedules =
  async (req, res) => {

    try {

      const schedules =
        await Schedule.find()
          .populate(populateEvent)
          .sort({
            updatedAt: -1,
          });

      res.status(200).json(
        schedules
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getScheduleByEvent =
  async (req, res) => {

    try {

      const schedule =
        await Schedule.findOne({
          event: req.params.eventId,
        }).populate(populateEvent);

      if (!schedule) {

        return res.status(200).json({
          event: req.params.eventId,
          days: [],
        });
      }

      res.status(200).json(
        schedule
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const upsertSchedule =
  async (req, res) => {

    try {

      const {
        eventId,
        days,
      } = req.body;

      if (!eventId) {

        return res
          .status(400)
          .json({
            message:
              "Event is required",
          });
      }

      const event =
        await Event.findById(
          eventId
        );

      if (!event) {

        return res
          .status(404)
          .json({
            message:
              "Event not found",
          });
      }

      if (!canManageEvent(event, req.user)) {

        return res
          .status(403)
          .json({
            message:
              "You can manage schedules only for your events",
          });
      }

      const schedule =
        await Schedule.findOneAndUpdate(
          {
            event: eventId,
          },
          {
            event: eventId,
            days: days || [],
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        ).populate(populateEvent);

      res.status(200).json(
        schedule
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const addSession =
  async (req, res) => {

    try {

      const {
        eventId,
      } = req.params;

      const {
        date,
        dayTitle,
        startTime,
        endTime,
        title,
        speaker,
        tag,
        venue,
        description,
      } = req.body;

      if (
        !date ||
        !startTime ||
        !title
      ) {

        return res
          .status(400)
          .json({
            message:
              "Date, start time, and title are required",
          });
      }

      const event =
        await Event.findById(
          eventId
        );

      if (!event) {

        return res
          .status(404)
          .json({
            message:
              "Event not found",
          });
      }

      if (!canManageEvent(event, req.user)) {

        return res
          .status(403)
          .json({
            message:
              "You can manage schedules only for your events",
          });
      }

      let schedule =
        await Schedule.findOne({
          event: eventId,
        });

      if (!schedule) {

        schedule =
          new Schedule({
            event: eventId,
            days: [],
          });
      }

      const requestedDate =
        new Date(date);

      const normalizedDate =
        requestedDate
          .toISOString()
          .slice(0, 10);

      let day =
        schedule.days.find(
          (item) =>
            item.date
              .toISOString()
              .slice(0, 10) ===
            normalizedDate
        );

      if (!day) {

        schedule.days.push({
          date: requestedDate,
          title: dayTitle,
          sessions: [],
        });

        day =
          schedule.days[
            schedule.days.length - 1
          ];
      }

      day.sessions.push({
        startTime,
        endTime,
        title,
        speaker,
        tag,
        venue,
        description,
      });

      schedule.days.sort(
        (first, second) =>
          first.date -
          second.date
      );

      schedule.days.forEach(
        (item) => {
          item.sessions.sort(
            (first, second) =>
              first.startTime.localeCompare(
                second.startTime
              )
          );
        }
      );

      await schedule.save();

      await schedule.populate(
        populateEvent
      );

      res.status(201).json(
        schedule
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getSchedules,
  getScheduleByEvent,
  upsertSchedule,
  addSession,
};
