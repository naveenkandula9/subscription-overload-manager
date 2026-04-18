const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const logger = require("../config/logger");

const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = StatusCodes.NOT_FOUND;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  if (statusCode >= 500) {
    logger.error(error.message, error.stack);
  }

  res.status(statusCode).json({
    message: error.message || getReasonPhrase(statusCode),
    details: error.details || null,
  });
};

module.exports = { notFoundHandler, errorHandler };

