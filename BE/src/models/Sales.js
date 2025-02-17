const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    checkoutId: {
      type: String, // Only for paymaya
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    receivedAmount: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["cash", "card", "paymaya", "gcash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      required: true,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Sales = mongoose.model("Sales", SalesSchema);
module.exports = Sales;
