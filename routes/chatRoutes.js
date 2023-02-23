const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removFromGroup,
  addToGroup,
  deleteChat,
  readBy,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats);
router.route("/").post(protect, accessChat);
router.route("/readby").put(protect, readBy);
router.route("/delete").delete(protect, deleteChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/group-remove").put(protect, removFromGroup);
router.route("/group-add").put(protect, addToGroup);

module.exports = router;
