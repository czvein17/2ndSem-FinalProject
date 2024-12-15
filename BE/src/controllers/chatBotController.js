const chatBotService = require("../services/chatBotService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const sendChatToBot = asyncHandler(async (req, res, next) => {
  const message = req.body.message;
  const userId = req.user._id;
  const response = await chatBotService.chatCompletion(userId, message);

  console.log(response.choices[0].message.content);

  res.status(200).json({ message: response });
});

const getAllConversation = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const conversation = await chatBotService.getAllConversation(userId);

  // Convert the conversation object to a JSON string
  const conversationJson = JSON.stringify(conversation);
  // Calculate the size of the JSON string in bytes
  const conversationSize = Buffer.byteLength(conversationJson, "utf8");
  // Convert the size to a readable format
  const readableSize = formatBytes(conversationSize);

  res.status(200).json({ fileSize: readableSize, conversation });
});

// Utility function to convert bytes to a human-readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

module.exports = {
  sendChatToBot,
  getAllConversation,
};
