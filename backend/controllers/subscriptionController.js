const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../utils/asyncHandler");
const {
  createSubscription,
  listSubscriptions,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
} = require("../services/subscriptionService");

const create = asyncHandler(async (req, res) => {
  const subscription = await createSubscription(req.user._id, req.validated.body);
  res.status(StatusCodes.CREATED).json({ subscription });
});

const list = asyncHandler(async (req, res) => {
  const subscriptions = await listSubscriptions(req.user._id);
  res.status(StatusCodes.OK).json({ subscriptions });
});

const getById = asyncHandler(async (req, res) => {
  const subscription = await getSubscriptionById(req.user._id, req.validated.params.id);
  res.status(StatusCodes.OK).json({ subscription });
});

const update = asyncHandler(async (req, res) => {
  const subscription = await updateSubscription(
    req.user._id,
    req.validated.params.id,
    req.validated.body
  );
  res.status(StatusCodes.OK).json({ subscription });
});

const remove = asyncHandler(async (req, res) => {
  const subscription = await cancelSubscription(req.user._id, req.validated.params.id);
  res.status(StatusCodes.OK).json({ subscription });
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
