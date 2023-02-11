const express = require("express");
const { accessChat } = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").get(protect, fetchChat)
router.route("/").post(protect, accessChat);
// router.route("/group").post(protect, createGroupChat)
// router.route("/rename").put(protect, renameGroup)
// router.route("/group-remove").put(protect, removFromGroup)
// router.route("/group-add").put(protect, addToGroup)

module.exports = router;
