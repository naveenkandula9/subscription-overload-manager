const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../utils/asyncHandler");
const { getDashboardSummary } = require("../services/dashboardService");

const summary = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardSummary(req.user._id);
  res.status(StatusCodes.OK).json(dashboard);
});

module.exports = { summary };
