const express =
  require("express");

const router =
  express.Router();

const {
  getSchedules,
  getScheduleByEvent,
  upsertSchedule,
  addSession,
} = require(
  "../controllers/scheduleController"
);

router.get(
  "/",
  getSchedules
);

router.get(
  "/event/:eventId",
  getScheduleByEvent
);

router.post(
  "/",
  upsertSchedule
);

router.post(
  "/event/:eventId/sessions",
  addSession
);

module.exports =
  router;
