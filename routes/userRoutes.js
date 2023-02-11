const express = require("express");
const {
  registerUser,
  authUser,
  searchUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);

router.route("/").get(protect, searchUser);

router.route("/login").post(authUser);

module.exports = router;
