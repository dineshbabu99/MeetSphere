const {
  protect,
} = require("./authMiddleware");

const adminOnly = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "Admin"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Admin access only",
  });
};

const adminOrOrganizer = (req, res, next) => {
  if (
    req.user &&
    [
      "Admin",
      "Event Organizer",
    ].includes(req.user.role)
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Admin or organizer access only",
  });
};

const userOnly = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "User"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Ticket booking is available only for users",
  });
};

module.exports = {
  protect,
  adminOnly,
  adminOrOrganizer,
  userOnly,
};
