const express = require("express");
const { protectAuth } = require("../middlewares/protectAuth");
const {
  sendChatToBot,
  getAllConversation,
  getConversationById,
  deleteConversationById,
} = require("../controllers/chatBotController");

const router = express.Router();

router.use(protectAuth);
router.post("/", sendChatToBot).get("/", getAllConversation);
router.route("/:id").get(getConversationById).delete(deleteConversationById);

module.exports = router;
