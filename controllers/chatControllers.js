const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat-model");
// const User = require("../models/user-model");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
});

module.exports = { accessChat };
