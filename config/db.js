const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb successfully connected");
  } catch (err) {
    console.log("failed to connect to MongoDB");
    console.log(err);
  }
};

module.exports = connectDB;
