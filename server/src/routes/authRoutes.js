const express = require("express");

const router =
  express.Router();

const {
  registerUser,
  LoginUser,
  getCurrentUser,
  updateCurrentUser,
  getUsers,
  updateUserRole,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");
const {
  adminOnly,
} = require("../middleware/adminMiddleware");

router.post("/register",registerUser);
router.post("/login", LoginUser);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateCurrentUser);
router.get("/users", protect, adminOnly, getUsers);
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
