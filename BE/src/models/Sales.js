const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
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

    recievedAmount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["pwd", "senior", "promo", "none"],
      default: "none",
    },
    modeOfPayment: {
      type: String,
      enum: ["cash", "card", "paymaya", "gcash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded"],
      required: true,
      default: "pending",
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    paymentDetails: {
      type: String,
      required: true,
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
