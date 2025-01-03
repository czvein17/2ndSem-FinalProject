const mongoose = require("mongoose");

const connectDB = async () => {
  let conn;

  switch (process.env.NODE_ENV) {
    case "local":
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        family: 4,
      });
      break;

    case "development":
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        family: 4,
      });
      break;

    case "production":
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        family: 4,
      });
      break;

    default:
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        family: 4,
      });
      break;
  }

  return conn;
};

module.exports = connectDB;
