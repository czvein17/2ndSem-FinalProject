const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["system", "assistant", "admin", "user"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
