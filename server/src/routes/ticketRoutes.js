const express =
  require("express");

const router =
  express.Router();



const {
  purchaseTicket,
  getTickets,
  getAllTickets,
  updateAttendanceStatus,
  deleteTicket,
} = require(
  "../controllers/ticketController"
);
const {
  protect,
  adminOnly,
} = require("../middleware/adminMiddleware");



router.post(
  "/purchase",
  purchaseTicket
);

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllTickets
);

router.patch(
  "/attendance/:id",
  protect,
  adminOnly,
  updateAttendanceStatus
);

router.get(
  "/:userId",
  getTickets
);

router.delete(
  "/:id",
  deleteTicket
);



module.exports =
  router;
