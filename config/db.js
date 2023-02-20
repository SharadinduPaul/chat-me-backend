const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.set("bufferCommands", false);
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      () => {
        console.log("Connected to DB");
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
