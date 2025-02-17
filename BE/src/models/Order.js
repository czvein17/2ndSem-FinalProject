const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"],
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
    recipient: {
      type: String,
      required: true,
    },
    orderItems: [OrderItemSchema],
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["pwd", "senior", "coupon", "none"],
      default: "none",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
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

OrderSchema.virtual("sales", {
  ref: "Sales",
  localField: "_id",
  foreignField: "order",
  justOne: true,
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
