const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat-model");
const User = require("../models/user-model");

//POST - /api/chat - {userId}
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (err) {
      res.status(401);
      throw new Error(err.message);
    }
  }
});

// GET /api/chat
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("readBy", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email pic",
    });

    res.status(200).send(chats);
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
});

//POST /api/chat/group - {users, name}
const createGroupChat = asyncHandler(async (req, res) => {
  const users = JSON.parse(req.body.users);
  const groupName = req.body.name;

  if (!users || !groupName) {
    return res.status(401).send({ message: "Please enter all the fields" });
  }
  if (users.length < 2) {
    return res
      .status(401)
      .send({ message: "More than 2 users are required to create a group" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: groupName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
});

//PUT /api/chat/group - {chatId, chatName}
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    res.status(401);
    throw new Error({ message: err.message });
  }
});
//PUT /api/chat/group-add - {chatId, userId}
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          users: userId,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    res.status(401);
    throw new Error({ message: err.message });
  }
});
//PUT /api/chat/group-add - {chatId, userId}
const removFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    res.status(401);
    throw new Error({ message: err.message });
  }
});
//PUT /api/chat/delete- {chatId}
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  try {
    const deletedChat = await Chat.findByIdAndDelete(chatId);
    res.status(200).send(deletedChat);
  } catch (err) {
    res.status(401);
    throw new Error({ message: err.message });
  }
});
//PUT /api/chat/readBy- {chatId, userId}
const readBy = asyncHandler(async (req, res) => {
  const { chatId, users } = req.body;
  if (!chatId) return res.status(401);
  try {
    const readByChat = await Chat.findByIdAndUpdate(
      chatId,
      { readBy: users },
      { new: true }
    )
      .populate("users", "-password")
      .populate("readBy", "-password");
    res.status(200).send(readByChat);
  } catch (err) {
    res.status(401);
    throw new Error({ message: err.message });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removFromGroup,
  deleteChat,
  readBy,
};
