const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication token is required.");
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists.");
  }

  req.user = user;
  next();
});

module.exports = { protect };

