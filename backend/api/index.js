const app = require("../app");
const { connectToDatabase } = require("../config/db");

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

