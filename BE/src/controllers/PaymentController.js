const axios = require("axios");
const orderService = require("../services/orderService");
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

require("dotenv").config();

const payWithPayMaya = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await orderService.findOrderById(orderId);
  if (!order) {
    return next(new ErrorResponse(404, "Order not found"));
  }

  const mayaAPI = "https://pg-sandbox.paymaya.com/checkout/v1/checkouts";

  const options = {
    data: {
      totalAmount: {
        currency: "PHP",
        value: `${order.totalAmount}`,
        details: {
          discount: `${order.discountAmount}`,
          serviceCharge: "0.00",
          shippingFee: "0.00",
          tax: `${order.tax}`,
          subtotal: `${order.subTotal}`,
        },
      },

      redirectUrl: {
        success: `http://localhost:5173/user?order=${orderId}&payment=success`,
        failure: "http://localhost:5173/failure",
        cancel: "http://localhost:5173/cancel",
      },

      items: order.orderItems.map((item) => ({
        name: item.product.name,
        code: item.product._id,
        description: item.product.description,
        quantity: item.quantity,
        amount: { value: item.price },
        totalAmount: { value: item.price },
      })),
      requestReferenceNumber: "5fc10b93-bdbd-4f31-b31d-4575a3785009",
      metadata: {
        logo: "https://cdn.ebaumsworld.com/mediaFiles/picture/1151541/84693449.png",
      },
    },
  };

  const response = await axios.post(mayaAPI, options.data, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_PUBLIC_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  await orderService.updateOrder(orderId, {
    checkoutId: response.data.checkoutId,
  });

  res.status(200).json({
    c: 200,
    m: "Payment request created successfully",
    d: response.data,
  });
});

const confirmPayment = asyncHandler(async (req, res, next) => {
  const { checkoutId } = req.params;

  const mayaAPI = `https://pg-sandbox.paymaya.com/payments/v1/payments/${checkoutId}`;

  const response = await axios.get(mayaAPI, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_SECRET_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  res.status(200).json({
    c: 200,
    m: "Payment confirmed successfully",
    d: response.data,
  });
});

module.exports = { payWithPayMaya, confirmPayment };
