const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/User");
const Subscription = require("../../models/Subscription");
const ReminderDispatch = require("../../models/ReminderDispatch");
const JobState = require("../../models/JobState");
const {
  findDueSubscriptions,
  processDueReminders,
  triggerReminderSweep,
} = require("../../services/reminderService");
const { sendReminderEmail } = require("../../services/emailService");

jest.setTimeout(60000);

describe("reminderService", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 30000,
      },
    });
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
    await Subscription.deleteMany({});
    await ReminderDispatch.deleteMany({});
    await JobState.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("sends a reminder once for a due subscription", async () => {
    const user = await User.create({
      name: "Reminder User",
      email: "user@example.com",
      password: "Password123",
    });

    await Subscription.create({
      userId: user._id,
      serviceName: "Netflix",
      renewalDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      remindBeforeDays: 1,
      price: 499,
      currency: "INR",
      billingCycle: "monthly",
    });

    const firstRun = await processDueReminders();
    const secondRun = await processDueReminders();

    expect(firstRun.sent).toBe(1);
    expect(secondRun.sent).toBe(0);
    expect(sendReminderEmail).toHaveBeenCalledTimes(1);
  });

  it("finds subscriptions whose reminder day is today", async () => {
    const user = await User.create({
      name: "Tomorrow User",
      email: "tomorrow@example.com",
      password: "Password123",
    });

    await Subscription.create({
      userId: user._id,
      serviceName: "YouTube Premium",
      renewalDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      remindBeforeDays: 1,
      price: 149,
      currency: "INR",
      billingCycle: "monthly",
    });

    const dueSubscriptions = await findDueSubscriptions();

    expect(dueSubscriptions).toHaveLength(1);
    expect(dueSubscriptions[0].serviceName).toBe("YouTube Premium");
  });

  it("throttles overlapping sweeps", async () => {
    const user = await User.create({
      name: "Timed User",
      email: "timed@example.com",
      password: "Password123",
    });

    await Subscription.create({
      userId: user._id,
      serviceName: "Prime",
      renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      remindBeforeDays: 2,
      price: 299,
      currency: "INR",
      billingCycle: "monthly",
    });

    const first = await triggerReminderSweep("test");
    const second = await triggerReminderSweep("test");

    expect(first.sent).toBe(1);
    expect(second.skipped).toBe(true);
  });
});
