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
} = require("../middleware/adminMiddleware");

router.post(
  "/create",
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
  adminOnly,
  updateEvent
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;
