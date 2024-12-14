const express = require("express");
const { sendChatToBot } = require("../controllers/chatBotController");

const router = express.Router();

router.post("/", sendChatToBot);

module.exports = router;
