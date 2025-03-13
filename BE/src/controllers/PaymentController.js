const axios = require("axios");
const orderService = require("../services/orderService");
const salesService = require("../services/salesService");
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const { generateTransactionId } = require("../utils/utils.js");

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
        success: `http://localhost:5173/user?order=${orderId}`,
        failure: "http://localhost:5173/failure",
        cancel: `http://localhost:5173/user?order=${orderId}`,
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
  console.log(response);
  console.log(response.data);

  let sale = await salesService.findSaleByOrderId(orderId);

  if (!sale) {
    await salesService.createSale({
      transactionId: generateTransactionId(),
      checkoutId: response.data.checkoutId,
      user: order.user,
      order: order._id,
      receivedAmount: 0,
      change: 0,
      modeOfPayment: "paymaya",
    });
  } else {
    await salesService.updateSales(sale._id, {
      checkoutId: response.data.checkoutId,
    });
  }

  await res.status(200).json({
    c: 200,
    m: "Payment request created successfully",
    d: response.data,
  });
});

const confirmPayment = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const sales = await salesService.findSaleByOrderId(orderId);

  if (!sales) {
    return next(new ErrorResponse(404, "Sales not found"));
  }

  const mayaAPI = `https://pg-sandbox.paymaya.com/payments/v1/payments/${sales.checkoutId}`;

  const response = await axios.get(mayaAPI, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_SECRET_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  console.log(response.data);

  if (response.data.status !== "PAYMENT_SUCCESS") {
    // return next(new ErrorResponse(400, "Payment failed"));

    return res.status(400).json({
      c: 400,
      m: "Payment failed",
      d: response.data,
    });
  }

  const updatedSales = await salesService.updateSales(sales._id, {
    receivedAmount: response.data.amount,
    paymentStatus: "paid",
  });

  res.status(200).json({
    c: 200,
    m: "Payment confirmed successfully",
    d: updatedSales,
    r: response.data,
  });
});

const debugMaya = asyncHandler(async (req, res, next) => {
  const { checkoutId } = req.params;

  const mayaAPI = `https://pg-sandbox.paymaya.com/payments/v1/payments/${checkoutId}`;

  const response = await axios.get(mayaAPI, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_SECRET_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  console.log(response.data);

  res.status(200).json({
    c: 200,
    m: "Payment confirmed successfully",
    d: response.data,
  });
});

const payWithCash = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.params;
  const { receiveAmount } = req.body;

  const order = await orderService.findOrderById(orderId);

  if (!order) {
    return next(new ErrorResponse(404, `Order not found with id ${orderId}`));
  }

  if (order.totalAmount > receiveAmount) {
    return next(new ErrorResponse(400, "Insufficient amount"));
  }

  const generateTransactionId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    return `TXN-${timestamp}-${randomString}`;
  };

  const totalAmount = order.totalAmount;
  const change = Math.max(0, (receiveAmount - totalAmount).toFixed(2));

  const payload = {
    transactionId: generateTransactionId(),
    user: user.id,
    order: orderId,
    receivedAmount: receiveAmount,
    change: change,
    modeOfPayment: "cash",
    paymentStatus: "paid",
  };

  const sale = await salesService.createSale(payload);

  res.status(201).json({
    c: 201,
    m: "Sale created successfully",
    d: sale,
  });
});

module.exports = { payWithPayMaya, confirmPayment, debugMaya, payWithCash };
