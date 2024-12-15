const express = require("express");
const { protectAuth } = require("../middlewares/protectAuth");
const {
  sendChatToBot,
  getAllConversation,
} = require("../controllers/chatBotController");

const router = express.Router();

router.use(protectAuth);
router.post("/", sendChatToBot).get("/", getAllConversation);

module.exports = router;
