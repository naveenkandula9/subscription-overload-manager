const path = require("path");
const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const rawEnv = {
  ...process.env,
  EMAIL_USER: process.env.EMAIL_USER || process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters").default("development-secret"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  EMAIL_USER: z.string().email("EMAIL_USER must be a valid email address"),
  EMAIL_PASS: z.string().min(1, "EMAIL_PASS is required"),
  EMAIL_FROM: z.string().default("Subscription Overload Manager <no-reply@example.com>"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  REMINDER_SWEEP_COOLDOWN_MINUTES: z.coerce.number().int().positive().default(15),
  REMINDER_BATCH_SIZE: z.coerce.number().int().positive().max(100).default(25),
  REMINDER_LOOKAHEAD_DAYS: z.coerce.number().int().positive().max(365).default(30),
  REMINDER_GRACE_DAYS: z.coerce.number().int().positive().max(60).default(14),
  REMINDER_CRON_SCHEDULE: z.string().default("0 9 * * *"),
  REMINDER_CRON_TIMEZONE: z.string().default("Asia/Kolkata"),
  CRON_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
}

const env = parsed.data;

module.exports = { env };
