require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(process.env.MONGODB_URI, {})
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.log(err));
  } catch (error) {
    return null;
  }
};
module.exports = connectDB;
