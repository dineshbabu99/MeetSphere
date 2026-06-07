const express = require("express");
const router = express.Router();

const {
  protect,
  userOnly,
} = require("../middleware/adminMiddleware");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", protect, userOnly, createOrder);
router.post("/verify", protect, userOnly, verifyPayment);

module.exports = router;
