const mongoose = require("mongoose");
const { env } = require("./env");
const logger = require("./logger");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getMongoUri = () => {
  const mongoUri = process.env.MONGO_URI || env.MONGO_URI;

  if (!mongoUri || !mongoUri.trim()) {
    throw new Error("MONGO_URI is undefined. Add a valid MongoDB Atlas URI to backend/.env.");
  }

  return mongoUri.trim();
};

const validateMongoUri = (mongoUri) => {
  if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    throw new Error("MONGO_URI must start with mongodb:// or mongodb+srv://");
  }

  let parsedUri;

  try {
    parsedUri = new URL(mongoUri);
  } catch (_error) {
    throw new Error("MONGO_URI is not a valid MongoDB connection string.");
  }

  const databaseName = parsedUri.pathname?.replace(/^\//, "");
  if (!databaseName) {
    logger.warn(
      "MONGO_URI does not include a database name. Example: mongodb+srv://<user>:<password>@cluster.mongodb.net/subscriptionDB"
    );
  }

  const authSegment = mongoUri.split("://")[1]?.split("@")[0] || "";
  if (authSegment.includes(":")) {
    const [rawUsername, rawPassword = ""] = authSegment.split(":");
    const hasReservedCharacters = /[\/?#\[\]@]/.test(rawUsername) || /[\/?#\[\]@]/.test(rawPassword);

    if (hasReservedCharacters) {
      logger.warn(
        "MONGO_URI username or password may contain reserved characters. Percent-encode them before placing them in the URI."
      );
    }
  }
};

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = getMongoUri();
    validateMongoUri(mongoUri);

    cached.promise = mongoose
      .connect(process.env.MONGO_URI || mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        logger.info("MongoDB Connected");
        return connection;
      })
      .catch((error) => {
        cached.promise = null;
        logger.error(`MongoDB connection failed: ${error.message}`);
        logger.error(error.stack || error);
        logger.warn(
          "If you are using MongoDB Atlas, verify the IP allowlist, database name in the URI, and that username/password are correctly encoded."
        );
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { connectToDatabase };
