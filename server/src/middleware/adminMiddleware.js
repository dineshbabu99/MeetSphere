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

module.exports = { protect, adminOnly, adminOrOrganizer };
