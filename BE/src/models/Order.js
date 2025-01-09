const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["cash", "Card", "paymaya", "gcash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "Cancelled"],
      required: true,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
