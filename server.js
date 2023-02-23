const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");

const app = express();

dotenv.config();
connectDB();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://web-chatme.netlify.app"],
  })
);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://web-chatme.netlify.app"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (user) => {
    socket.join(user?._id);
    console.log(user?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room : ", room);
  });

  socket.on("new message", (newMessage) => {
    const { chat, sender } = newMessage;

    if (!chat.users) return console.log("no user found");

    chat.users.forEach((user) => {
      if (user._id == sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.on("read", (data) => {
    const { room, users } = data;
    socket.in(room).emit("read by", { room, users });
  });
});

app.get("/", (req, res) => {
  res.send("Hey, server is running ...");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);
