const chatBotService = require("../services/chatBotService");
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const sendChatToBot = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { message, conversationId } = req.body;
  const userId = req.user._id;
  const { response, conversationId: _id } = await chatBotService.chatCompletion(
    userId,
    message,
    conversationId
  );

  console.log(response.choices[0].message.content);

  res.status(200).json({ conversationId: _id, message: response });
});

const getAllConversation = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const conversation = await chatBotService.getAllConversation(userId);

  // Convert the conversation object to a JSON string
  // Calculate the size of the JSON string in bytes
  // Convert the size to a readable format
  const conversationJson = JSON.stringify(conversation);
  const conversationSize = Buffer.byteLength(conversationJson, "utf8");
  const readableSize = formatBytes(conversationSize);

  res.status(200).json({
    fileSize: readableSize,
    length: conversation.length,
    conversation,
  });
});

const getConversationById = asyncHandler(async (req, res, next) => {
  const conversationId = req.params.id;

  const conversation = await chatBotService.getConversationById(conversationId);

  if (!conversation) {
    return next(new ErrorResponse(404, "Conversation not found"));
  }

  res.status(200).json({ conversation });
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

const deleteConversationById = asyncHandler(async (req, res, next) => {
  const conversationId = req.params.id;

  const conversation = await chatBotService.deleteConversationById(
    conversationId
  );

  if (!conversation) {
    return next(new ErrorResponse(404, "Conversation not found"));
  }

  res
    .status(200)
    .json({ id: conversation._id, message: "Conversation deleted" });
});

module.exports = {
  sendChatToBot,
  getAllConversation,
  getConversationById,
  deleteConversationById,
};
