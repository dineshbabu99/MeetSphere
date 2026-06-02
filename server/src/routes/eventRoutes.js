const express =
  require("express");

const router =
  express.Router();

const {
  createEvent,
  getEvents,
  updateEventStatus,
  updateEvent,
  deleteEvent,
} = require(
  "../controllers/eventController"
);
const {
  protect,
  adminOnly,
  adminOrOrganizer,
} = require("../middleware/adminMiddleware");

router.post(
  "/create",
  protect,
  adminOrOrganizer,
  createEvent
);

router.get(
  "/",
  getEvents
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateEventStatus
);

router.put(
  "/:id",
  protect,
  adminOrOrganizer,
  updateEvent
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;
