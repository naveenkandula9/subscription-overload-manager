const Subscription = require("../models/Subscription");
const ReminderDispatch = require("../models/ReminderDispatch");
const JobState = require("../models/JobState");
const User = require("../models/User");
const { env } = require("../config/env");
const logger = require("../config/logger");
const { addDays, subtractDays, endOfUtcDay, startOfUtcDay } = require("../utils/date");
const { sendReminderEmail } = require("./emailService");

const JOB_NAME = "daily-renewal-reminder-sweep";

const getDispatchKey = (subscription) =>
  `${subscription._id.toString()}:${new Date(subscription.renewalDate).toISOString()}`;

const getReminderLeadTime = (subscription) =>
  Number.isInteger(subscription.remindBeforeDays) ? subscription.remindBeforeDays : 3;

const acquireJobLock = async () => {
  const now = new Date();
  const cooldownThreshold = new Date(now.getTime() - env.REMINDER_SWEEP_COOLDOWN_MINUTES * 60 * 1000);
  const lockUntil = new Date(now.getTime() + 5 * 60 * 1000);

  const currentJob = await JobState.findOne({ jobName: JOB_NAME }).lean();
  if (currentJob) {
    const isLocked = currentJob.lockedUntil && new Date(currentJob.lockedUntil) > now;
    const isCoolingDown = currentJob.lastRunAt && new Date(currentJob.lastRunAt) > cooldownThreshold;

    if (isLocked || isCoolingDown) {
      return false;
    }
  }

  const updated = await JobState.findOneAndUpdate(
    {
      jobName: JOB_NAME,
      $or: [{ lockedUntil: null }, { lockedUntil: { $lte: now } }],
    },
    {
      $set: {
        jobName: JOB_NAME,
        lockedUntil: lockUntil,
        lastRunAt: now,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return updated && new Date(updated.lockedUntil).getTime() === lockUntil.getTime();
};

const releaseJobLock = async (lastResult) => {
  await JobState.findOneAndUpdate(
    { jobName: JOB_NAME },
    {
      $set: {
        lockedUntil: null,
        lastCompletedAt: new Date(),
        lastResult,
      },
    }
  );
};

const claimDispatch = async (subscription, reminderDate) => {
  const dispatchKey = getDispatchKey(subscription);
  const existing = await ReminderDispatch.findOne({ dispatchKey });

  if (existing?.status === "sent") {
    return null;
  }

  const staleCutoff = new Date(Date.now() - 15 * 60 * 1000);

  if (existing && existing.status === "processing" && existing.updatedAt > staleCutoff) {
    return null;
  }

  if (existing) {
    return ReminderDispatch.findByIdAndUpdate(
      existing._id,
      {
        $set: {
          userId: subscription.userId,
          subscriptionId: subscription._id,
          renewalDate: subscription.renewalDate,
          reminderDate,
          status: "processing",
          lastError: null,
        },
        $inc: {
          attemptCount: 1,
        },
      },
      { new: true }
    );
  }

  return ReminderDispatch.create({
    dispatchKey,
    userId: subscription.userId,
    subscriptionId: subscription._id,
    renewalDate: subscription.renewalDate,
    reminderDate,
    status: "processing",
    attemptCount: 1,
  });
};

const markDispatchResult = async (dispatchId, status, lastError = null) => {
  const update = {
    status,
    lastError,
  };

  if (status === "sent") {
    update.sentAt = new Date();
  }

  return ReminderDispatch.findByIdAndUpdate(dispatchId, update, { new: true });
};

const findDueSubscriptions = async () => {
  const now = new Date();
  const minRenewalDate = addDays(now, -env.REMINDER_GRACE_DAYS);
  const maxRenewalDate = addDays(now, env.REMINDER_LOOKAHEAD_DAYS);
  const todayEnd = endOfUtcDay(now);
  const todayStart = startOfUtcDay(now);
  const candidateLimit = Math.max(env.REMINDER_BATCH_SIZE * 5, env.REMINDER_BATCH_SIZE);

  const subscriptions = await Subscription.find({
    status: "active",
    reminderSent: { $ne: true },
    renewalDate: {
      $gte: minRenewalDate,
      $lte: maxRenewalDate,
    },
  })
    .sort({ renewalDate: 1 })
    .limit(candidateLimit)
    .lean();

  return subscriptions
    .filter((subscription) => {
      const reminderDate = subtractDays(subscription.renewalDate, getReminderLeadTime(subscription));
      const reminderDay = startOfUtcDay(reminderDate);

      return subscription.renewalDate >= todayStart && reminderDay <= todayEnd;
    })
    .slice(0, env.REMINDER_BATCH_SIZE);
};

const processDueReminders = async () => {
  const dueSubscriptions = await findDueSubscriptions();
  let sentCount = 0;
  let failedCount = 0;

  for (const subscription of dueSubscriptions) {
    const reminderDate = subtractDays(subscription.renewalDate, getReminderLeadTime(subscription));
    const dispatch = await claimDispatch(subscription, reminderDate);

    if (!dispatch || dispatch.status === "sent") {
      continue;
    }

    const user = await User.findById(subscription.userId).lean();
    if (!user) {
      await markDispatchResult(dispatch._id, "failed", "User not found");
      failedCount += 1;
      continue;
    }

    try {
      await sendReminderEmail({
        userEmail: user.email,
        userName: user.name,
        subscription,
      });

      await markDispatchResult(dispatch._id, "sent");
      await Subscription.findByIdAndUpdate(subscription._id, {
        $set: {
          lastNotifiedAt: new Date(),
          reminderSent: true,
        },
      });
      sentCount += 1;
    } catch (error) {
      logger.error("Reminder email send failed", error.message);
      await markDispatchResult(dispatch._id, "failed", error.message);
      failedCount += 1;
    }
  }

  return {
    scanned: dueSubscriptions.length,
    sent: sentCount,
    failed: failedCount,
  };
};

const triggerReminderSweep = async (reason = "request") => {
  const lockAcquired = await acquireJobLock();

  if (!lockAcquired) {
    return { skipped: true, reason: "cooldown_or_lock" };
  }

  try {
    const result = await processDueReminders();
    await releaseJobLock(JSON.stringify({ reason, ...result }));
    return result;
  } catch (error) {
    await releaseJobLock(`failed:${error.message}`);
    throw error;
  }
};

const triggerReminderSweepSafely = async (reason = "request") => {
  try {
    return await triggerReminderSweep(reason);
  } catch (error) {
    logger.warn("Reminder sweep skipped after recoverable failure", error.message);
    return { skipped: true, reason: "failed", error: error.message };
  }
};

module.exports = {
  JOB_NAME,
  getDispatchKey,
  findDueSubscriptions,
  processDueReminders,
  triggerReminderSweep,
  triggerReminderSweepSafely,
};
