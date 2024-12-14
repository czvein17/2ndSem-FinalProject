const chatBotService = require("../services/chatBotService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const sendChatToBot = asyncHandler(async (req, res, next) => {
  const message = req.body.message;
  const response = await chatBotService.chatCompletion(message);

  console.log(response.choices[0].message.content);

  res.status(200).json({ message: response });
});

module.exports = {
  sendChatToBot,
};
