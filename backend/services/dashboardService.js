const Subscription = require("../models/Subscription");
const ReminderDispatch = require("../models/ReminderDispatch");
const { addDays } = require("../utils/date");

const billingCycleToMonthlyFactor = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

const getDashboardSummary = async (userId) => {
  const now = new Date();
  const nextSevenDays = addDays(now, 7);

  const subscriptions = await Subscription.find({ userId }).sort({ renewalDate: 1 }).lean();
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === "active");
  const upcomingRenewals = activeSubscriptions.filter(
    (subscription) => subscription.renewalDate >= now && subscription.renewalDate <= nextSevenDays
  );

  const totalMonthlySpend = activeSubscriptions.reduce((sum, subscription) => {
    const factor = billingCycleToMonthlyFactor[subscription.billingCycle] || 1;
    return sum + subscription.price * factor;
  }, 0);

  const totalYearlyCommitment = activeSubscriptions.reduce((sum, subscription) => {
    const factor = billingCycleToMonthlyFactor[subscription.billingCycle] || 1;
    return sum + subscription.price * factor * 12;
  }, 0);

  const recentDispatches = await ReminderDispatch.find({ userId, status: "sent" })
    .sort({ sentAt: -1 })
    .limit(5)
    .lean();

  return {
    metrics: {
      totalMonthlySpend,
      totalYearlyCommitment,
      activeSubscriptions: activeSubscriptions.length,
      upcomingRenewals: upcomingRenewals.length,
    },
    subscriptions: activeSubscriptions.slice(0, 5).map((subscription) => ({
      id: subscription._id,
      name: subscription.serviceName || subscription.name,
      serviceName: subscription.serviceName || subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      billingCycle: subscription.billingCycle,
      renewalDate: subscription.renewalDate,
      status: subscription.status,
    })),
    reminders: upcomingRenewals.slice(0, 5).map((subscription) => ({
      id: subscription._id,
      name: subscription.serviceName || subscription.name,
      serviceName: subscription.serviceName || subscription.name,
      renewalDate: subscription.renewalDate,
      remindBeforeDays: subscription.remindBeforeDays,
    })),
    insights: {
      highestSubscription:
        activeSubscriptions
          .slice()
          .sort((left, right) => right.price - left.price)
          .map((subscription) => ({
            name: subscription.serviceName || subscription.name,
            serviceName: subscription.serviceName || subscription.name,
            price: subscription.price,
            currency: subscription.currency,
          }))[0] || null,
      recentDispatches: recentDispatches.map((dispatch) => ({
        id: dispatch._id,
        sentAt: dispatch.sentAt,
        renewalDate: dispatch.renewalDate,
      })),
    },
  };
};

module.exports = { getDashboardSummary };
