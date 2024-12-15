const { openai } = require("../config/openai");
const Conversation = require("../models/Conversation");

const chatCompletion = async (userId, message) => {
  // Find the conversation for the user or create a new one
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = new Conversation({ userId, messages: [] });
  }

  // Add the new user message to the conversation history
  conversation.messages.push({
    role: "user",
    content: message,
  });

  // Prepare the messages array for the API request
  const messages = conversation.messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Add the system message if it's the first message
  if (messages.length === 1) {
    messages.unshift({
      role: "system",
      content: "You are a helpful assistant.",
    });
  }

  // Make the API request
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  // Add the assistant's response to the conversation history
  const botMessage = {
    role: "assistant",
    content: response.choices[0].message.content,
  };
  conversation.messages.push(botMessage);

  // Save the conversation
  await conversation.save();

  return response;
};

const getAllConversation = async (userId) => {
  const conversation = await Conversation.find({ userId });
  return conversation;
};

module.exports = {
  chatCompletion,
  getAllConversation,
};
