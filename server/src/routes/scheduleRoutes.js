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

const {
  protect,
  adminOrOrganizer,
} = require("../middleware/adminMiddleware");

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
  protect,
  adminOrOrganizer,
  upsertSchedule
);

router.post(
  "/event/:eventId/sessions",
  protect,
  adminOrOrganizer,
  addSession
);

module.exports =
  router;
