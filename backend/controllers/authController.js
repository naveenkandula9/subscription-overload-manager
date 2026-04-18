const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../utils/asyncHandler");
const { loginUser, registerUser, sanitizeUser } = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.validated.body);
  res.status(StatusCodes.CREATED).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.validated.body);
  res.status(StatusCodes.OK).json(result);
});

const me = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    user: sanitizeUser(req.user),
  });
});

module.exports = { register, login, me };
