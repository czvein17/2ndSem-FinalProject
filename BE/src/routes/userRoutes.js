const express = require("express");
const { protectAuth, restrictTo } = require("../middlewares/protectAuth");
const { getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.route("/").get(protectAuth, restrictTo("admin"), getAllUsers);

module.exports = router;
