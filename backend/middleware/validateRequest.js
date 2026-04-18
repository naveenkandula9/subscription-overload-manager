const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

const validateRequest = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Validation failed.",
      result.error.flatten()
    );
  }

  req.validated = result.data;
  next();
};

module.exports = validateRequest;

