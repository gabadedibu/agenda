const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Mongo URI loaded:", process.env.MONGO_URI ? "YES" : "NO");

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;