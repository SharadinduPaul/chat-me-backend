const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     mongoose.set("strictQuery", false);
//     mongoose.connect(process.env.MONGO_URI);

//     console.log("mongodb successfully connected");
//   } catch (err) {
//     console.log("failed to connect to MongoDB");
//     console.log(err);
//   }
// };

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
    console.log("inside mongoose connect try block")
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
