const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../utils/asyncHandler");

const health = asyncHandler(async (_req, res) => {
  res.status(StatusCodes.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = { health };

