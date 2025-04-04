const productService = require("../services/productService");
const orderService = require("../services/orderService");
const ingredientService = require("../services/ingredientService");
const salesService = require("../services/salesService");

const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const { validateMayaPayment } = require("../utils/payment");

const createOrder = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { orderItems, discountType } = req.body;

  const orderItemsDetails = [];
  const ingredientUpdates = {};
  let subTotal = 0;

  for (const item of orderItems) {
    const { id, size, quantity } = item;
    const product = await productService.getProductById(id);

    if (!product) {
      return next(new ErrorResponse(404, `Product not found with id ${id}`));
    }

    const itemPrice = product.prices[size];
    const itemTotal = itemPrice * quantity;
    subTotal += itemTotal;

    orderItemsDetails.push({
      product: product._id,
      size,
      quantity,
      price: itemPrice,
    });

    // Calculate the total quantity required for each ingredient
    for (const ingredient of product.ingredients) {
      const ingredientId = ingredient.ingredient._id.toString(); //
      const ingredientQuantity = ingredient.quantity[size] * quantity;

      if (!ingredientUpdates[ingredientId]) {
        ingredientUpdates[ingredientId] = 0;
      }

      ingredientUpdates[ingredientId] += ingredientQuantity;
    }
  }

  const tax = parseFloat((subTotal * 0.12).toFixed(2)); // 12% tax
  let discountAmount = 0;

  if (discountType === "pwd" || discountType === "senior") {
    discountAmount = subTotal * 0.2; // 20% discount
  }

  const totalAmount = subTotal + tax - discountAmount;

  const payload = {
    user: user.id,
    recipient: req.body.recipient,
    orderItems: orderItemsDetails,
    subTotal,
    tax,
    discountAmount,
    discountType: discountType || "none",
    totalAmount,
  };

  const order = await orderService.createOrder(payload);

  console.log("ingredientUpdates ", ingredientUpdates);
  // Update the stock of each ingredient
  for (const [ingredientId, quantity] of Object.entries(ingredientUpdates)) {
    await ingredientService.updateIngredientStock(ingredientId, -quantity);
  }

  res.status(201).json({
    c: 201,
    m: "Order created successfully",
    d: order,
  });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await orderService.findOrderById(orderId);

  if (!order) {
    return next(new ErrorResponse(404, `Order not found with id ${orderId}`));
  }

  try {
    if (order.sales && order.sales.checkoutId) {
      const result = await validateMayaPayment(order.sales);

      if (result.status === "success") {
        order.sales = result.data;
      } else if (result.status === "failed") {
        order.sales.paymentStatus = "pending";
      }

      await order.save();
    }
  } catch (error) {
    console.error("Payment validation failed:", error.message);
  }

  res.status(200).json({
    c: 200,
    m: "Order fetched successfully",
    d: order,
  });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.findAllOrders(req);

  res.status(200).json({
    c: 200,
    m: "Orders fetched successfully",
    d: orders,
  });
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const salesOrder = await salesService.findSaleByOrderId(orderId);

  if (!salesOrder) {
    return next(
      new ErrorResponse(404, `Sales order not found with order id ${orderId}`)
    );
  }

  if (salesOrder.paymentStatus !== "paid") {
    return next(
      new ErrorResponse(
        400,
        `Order payment is not yet paid therefor cannot be updated`
      )
    );
  }

  const order = await orderService.updateOrder(orderId, { status });

  if (!order) {
    return next(new ErrorResponse(404, `Order not found with id ${orderId}`));
  }

  res.status(200).json({
    c: 200,
    m: "Order updated successfully",
    d: order,
  });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await orderService.deleteOrder(orderId);
  if (!order) {
    return next(new ErrorResponse(404, `Order not found with id ${orderId}`));
  }

  res.status(200).json({
    c: 200,
    m: "Order deleted successfully",
    d: null,
  });
});

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
