const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

const protectAuth = asyncHandler(async (req, res, next) => {
  if (
    !req.headers?.authorization &&
    !req.headers.authorization?.startsWith("Bearer")
  )
    return next(new ErrorResponse(401, "Unauthorized access"));

  let token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new ErrorResponse(401, "Unauthorized access"));

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorResponse(
          403,
          "You do not have permission to perform this action"
        )
      );
    next();
  };
};

module.exports = {
  protectAuth,
  restrictTo,
};
