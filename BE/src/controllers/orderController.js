const productService = require("../services/productService");
const orderService = require("../services/orderService");
const salesService = require("../services/salesService");

const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const { validateMayaPayment } = require("../utils/payment");

const createOrder = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { orderItems, discountType } = req.body;

  const orderItemsDetails = [];
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
  }

  const tax = subTotal * 0.12; // 12% tax
  let discountAmount = 0;

  if (discountType === "pwd" || discountType === "senior") {
    discountAmount = subTotal * 0.2; // 20% discount
  }

  const totalAmount = subTotal + tax - discountAmount;

  const payload = {
    user: user.id,
    recipient: "John Doe",
    orderItems: orderItemsDetails,
    subTotal,
    tax,
    discountAmount,
    discountType: discountType || "none",
    totalAmount,
  };

  const order = await orderService.createOrder(payload);

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

  if (order.sales && order.sales.checkoutId) {
    const updatedSales = await validateMayaPayment(order.sales);
    if (updatedSales) {
      order.sales = updatedSales;
      await order.save();
    }
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

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
};
