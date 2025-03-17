const { openai } = require("../config/openai");
const Conversation = require("../models/Conversation");

const SalesService = require("./salesService");
const ProductService = require("./productService");

const chatCompletion = async (req, userId, message, conversationId = null) => {
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
      content: `You are CUP OF CHI's chatbot assistant. Your role is strictly limited to handling queries related to the Point of Sale (POS) system, including sales monitoring, product details, and other POS-related tasks. 

    ⚠️ Do NOT assist with any topic unrelated to the POS system.  
    ⚠️ If asked anything outside of your scope, respond with:  
    "I can only assist with CUP OF CHI's POS system. Please ask about sales, products, or POS-related tasks."  

    Always ensure all monetary values are displayed in Philippine Pesos (₱).`,
    });
  }

  // Check if the message contains keywords related to sales or product data
  if (message.toLowerCase().includes("sales")) {
    const salesData = await SalesService.getSales(req);

    // Convert "$" to "₱" in sales data
    const formattedSalesData = JSON.stringify(salesData, null, 2).replace(
      /\$/g,
      "₱"
    );

    messages.push({
      role: "system",
      content: `Here is the sales data: ${formattedSalesData}`,
    });
  }

  if (message.toLowerCase().includes("product")) {
    const productData = await ProductService.findAllProducts(req);

    // Convert "$" to "₱" in product data
    const formattedProductData = JSON.stringify(productData, null, 2).replace(
      /\$/g,
      "₱"
    );

    messages.push({
      role: "system",
      content: `Here is the product data: ${formattedProductData}`,
    });
  }

  console.log(messages);

  // Make the API request
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  // Add the assistant's response to the conversation history
  let botMessageContent = response.choices[0].message.content;

  // Ensure the assistant always displays Philippine Pesos (₱)
  botMessageContent = botMessageContent.replace(/\$/g, "₱");

  // Prevent responses unrelated to the POS system
  if (
    !botMessageContent.toLowerCase().includes("sales") &&
    !botMessageContent.toLowerCase().includes("product")
  ) {
    botMessageContent =
      "I can only assist with CUP OF CHI's POS system. Please ask about sales, products, or POS-related tasks.";
  }

  const botMessage = {
    role: "assistant",
    content: botMessageContent,
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
