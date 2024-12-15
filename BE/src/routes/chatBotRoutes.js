const express = require("express");
const { protectAuth } = require("../middlewares/protectAuth");
const {
  sendChatToBot,
  getAllConversation,
  getConversationById,
} = require("../controllers/chatBotController");

const router = express.Router();

router.use(protectAuth);
router.post("/", sendChatToBot).get("/", getAllConversation);
router.get("/:id", getConversationById);

module.exports = router;
