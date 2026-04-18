require('dotenv').config();
const { createServer } = require("http");
const app = require("./app");
const { connectToDatabase } = require("./config/db");
const { env } = require("./config/env");
const logger = require("./config/logger");
const { startReminderScheduler } = require("./jobs/reminderScheduler");

const startServer = async () => {
  try {
    await connectToDatabase();
    startReminderScheduler();
    const server = createServer(app);

    server.listen(env.PORT, () => {
      logger.info(`Backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    logger.error(error.stack || error);
    process.exit(1);
  }
};

startServer();
