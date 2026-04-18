const { StatusCodes } = require("http-status-codes");
const Subscription = require("../models/Subscription");
const ReminderDispatch = require("../models/ReminderDispatch");
const ApiError = require("../utils/ApiError");
const { toUtcDate } = require("../utils/date");

const mapSubscription = (subscription) => ({
  id: subscription._id,
  userId: subscription.userId,
  name: subscription.serviceName || subscription.name,
  serviceName: subscription.serviceName || subscription.name,
  renewalDate: subscription.renewalDate,
  remindBeforeDays: subscription.remindBeforeDays,
  price: subscription.price,
  currency: subscription.currency,
  billingCycle: subscription.billingCycle,
  status: subscription.status,
  reminderSent: Boolean(subscription.reminderSent),
  lastNotifiedAt: subscription.lastNotifiedAt,
  createdAt: subscription.createdAt,
  updatedAt: subscription.updatedAt,
});

const createSubscription = async (userId, payload) => {
  const renewalDate = toUtcDate(payload.renewalDate);
  if (!renewalDate) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid renewal date.");
  }

  const subscription = await Subscription.create({
    userId,
    ...payload,
    renewalDate,
    currency: payload.currency.toUpperCase(),
    reminderSent: false,
  });

  return mapSubscription(subscription);
};

const listSubscriptions = async (userId) => {
  const subscriptions = await Subscription.find({ userId })
    .sort({ renewalDate: 1, createdAt: -1 })
    .lean();

  return subscriptions.map(mapSubscription);
};

const getSubscriptionById = async (userId, id) => {
  const subscription = await Subscription.findOne({ _id: id, userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found.");
  }
  return mapSubscription(subscription);
};

const updateSubscription = async (userId, id, payload) => {
  const existingSubscription = await Subscription.findOne({ _id: id, userId });
  if (!existingSubscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found.");
  }

  if (payload.renewalDate) {
    const renewalDate = toUtcDate(payload.renewalDate);
    if (!renewalDate) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid renewal date.");
    }
    existingSubscription.renewalDate = renewalDate;
  }

  if (payload.serviceName !== undefined || payload.name !== undefined) {
    const serviceName = payload.serviceName ?? payload.name;
    existingSubscription.serviceName = serviceName;
    existingSubscription.name = serviceName;
  }
  if (payload.remindBeforeDays !== undefined)
    existingSubscription.remindBeforeDays = payload.remindBeforeDays;
  if (payload.price !== undefined) existingSubscription.price = payload.price;
  if (payload.currency !== undefined) existingSubscription.currency = payload.currency.toUpperCase();
  if (payload.billingCycle !== undefined) existingSubscription.billingCycle = payload.billingCycle;

  if (payload.renewalDate || payload.remindBeforeDays !== undefined) {
    existingSubscription.reminderSent = false;
    existingSubscription.lastNotifiedAt = null;
    await ReminderDispatch.deleteMany({ subscriptionId: existingSubscription._id });
  }

  await existingSubscription.save();

  return mapSubscription(existingSubscription);
};

const cancelSubscription = async (userId, id) => {
  const subscription = await Subscription.findOne({ _id: id, userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found.");
  }

  subscription.status = "cancelled";
  await subscription.save();

  return mapSubscription(subscription);
};

module.exports = {
  createSubscription,
  listSubscriptions,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
  mapSubscription,
};
