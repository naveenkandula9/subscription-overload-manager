process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-123";
process.env.JWT_EXPIRES_IN = "7d";
process.env.EMAIL_USER = "test@example.com";
process.env.EMAIL_PASS = "password";
process.env.EMAIL = "test@example.com";
process.env.EMAIL_PASSWORD = "password";
process.env.EMAIL_FROM = "test@example.com";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock("../services/emailService", () => ({
  sendReminderEmail: jest.fn().mockResolvedValue({ messageId: "mocked-id" }),
  buildReminderTemplate: jest.fn(),
}));
