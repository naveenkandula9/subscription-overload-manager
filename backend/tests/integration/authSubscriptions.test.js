const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const User = require("../../models/User");
const Subscription = require("../../models/Subscription");
const ReminderDispatch = require("../../models/ReminderDispatch");
const JobState = require("../../models/JobState");

jest.setTimeout(60000);

describe("auth and subscriptions api", () => {
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

  it("registers, logs in, and performs subscription CRUD", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Owner User",
      email: "owner@example.com",
      password: "Password123",
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "owner@example.com",
      password: "Password123",
    });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;

    const createResponse = await request(app)
      .post("/api/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Spotify",
        renewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        remindBeforeDays: 2,
        price: 119,
        currency: "INR",
        billingCycle: "monthly",
      });

    expect(createResponse.status).toBe(201);

    const dashboardResponse = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(dashboardResponse.status).toBe(200);
    expect(dashboardResponse.body.metrics.activeSubscriptions).toBe(1);
    expect(dashboardResponse.body.metrics.upcomingRenewals).toBe(0);
    expect(dashboardResponse.body.metrics.totalMonthlySpend).toBe(119);
    expect(dashboardResponse.body.metrics.totalYearlyCommitment).toBe(1428);
    expect(dashboardResponse.body.insights.highestSubscription.name).toBe("Spotify");

    const listResponse = await request(app)
      .get("/api/subscriptions")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.subscriptions).toHaveLength(1);

    const subscriptionId = listResponse.body.subscriptions[0].id;

    const updateResponse = await request(app)
      .put(`/api/subscriptions/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 149 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.subscription.price).toBe(149);

    const deleteResponse = await request(app)
      .delete(`/api/subscriptions/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.subscription.status).toBe("cancelled");
  });
});
