const { openai } = require("../config/openai");
const Conversation = require("../models/Conversation");

const chatCompletion = async (userId, message, conversationId = null) => {
  let conversation;

  // Find the conversation by ID
  if (conversationId)
    conversation = await Conversation.findById({ _id: conversationId });
  else {
    // if no conversation ID is provided, create a new conversation
    const conversationTitle = await generateTitle(message);

    conversation = await Conversation.create({
      userId,
      conversationTitle,
      messages: [],
    });

    // Find the conversation for the user or create a new one
    // conversation = await Conversation.findOne({ userId });
    // if (!conversation) {
    //   const conversationTitle = await generateTitle(message);
    //   conversation = new Conversation({
    //     userId,
    //     conversationTitle,
    //     messages: [],
    //   });
    // }
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

  return { response, conversationId: conversation._id };
};

const generateTitle = async (message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate a short and descriptive title for the following conversation:",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0].message.content.trim();
};

const getAllConversation = async (userId) => {
  const conversation = await Conversation.find({ userId });
  return conversation;
};

const getConversationById = async (conversationId) => {
  const conversation = await Conversation.findById({ _id: conversationId });
  return conversation;
};

const deleteConversationById = async (conversationId) => {
  const conversation = await Conversation.findByIdAndDelete({
    _id: conversationId,
  });

  return conversation;
};

module.exports = {
  chatCompletion,
  getAllConversation,
  getConversationById,
  deleteConversationById,
};
