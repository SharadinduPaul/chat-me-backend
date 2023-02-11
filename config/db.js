const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb successfully connected" + conn.connection.host);
  } catch (err) {
    console.log("failed to connect to MongoDB");
    console.log(err);
  }
};

module.exports = connectDB;
