const {
  protect,
} = require("./authMiddleware");

const adminOnly = (req, res, next) => {
  if (
    req.user &&
    [
      "SuperAdmin",
      "Admin",
    ].includes(req.user.role)
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Admin access only",
  });
};

module.exports = { protect, adminOnly };
