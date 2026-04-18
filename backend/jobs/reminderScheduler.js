const logger = require("../config/logger");
const { env } = require("../config/env");
const { triggerReminderSweepSafely } = require("../services/reminderService");

let scheduledTask = null;

const loadCron = () => {
  try {
    return require("node-cron");
  } catch (_error) {
    logger.warn(
      "node-cron is not installed yet. Run `npm install` inside backend to enable the daily reminder scheduler."
    );
    return null;
  }
};

const startReminderScheduler = () => {
  if (env.NODE_ENV === "test") {
    return null;
  }

  if (scheduledTask) {
    return scheduledTask;
  }

  const cron = loadCron();
  if (!cron) {
    return null;
  }

  if (typeof cron.validate === "function" && !cron.validate(env.REMINDER_CRON_SCHEDULE)) {
    throw new Error(`Invalid reminder cron schedule: ${env.REMINDER_CRON_SCHEDULE}`);
  }

  scheduledTask = cron.schedule(
    env.REMINDER_CRON_SCHEDULE,
    async () => {
      logger.info("Running scheduled renewal reminder sweep");
      const result = await triggerReminderSweepSafely("daily_cron");
      logger.info("Scheduled renewal reminder sweep finished", result);
    },
    {
      timezone: env.REMINDER_CRON_TIMEZONE,
    }
  );

  logger.info("Reminder scheduler started", {
    schedule: env.REMINDER_CRON_SCHEDULE,
    timezone: env.REMINDER_CRON_TIMEZONE,
  });

  return scheduledTask;
};

module.exports = {
  startReminderScheduler,
};
