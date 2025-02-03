const orderService = require("../services/orderService");
const productService = require("../services/productService");
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const createOrder = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { orderItems } = req.body;

  console.log(orderItems);
  const orderItemsDetails = [];
  let subtotal = 0;

  for (const item of orderItems) {
    const { id, size, quantity } = item;
    const product = await productService.getProductById(id);

    if (!product) {
      return next(new ErrorResponse(404, `Product not found with id ${id}`));
    }

    const itemTotal = product.price * quantity;
    subtotal += itemTotal;

    orderItemsDetails.push({
      product: product._id,
      size,
      quantity,
      price: product.price * quantity,
    });
  }

  const payload = {
    user: user.id,
    orderItems: orderItemsDetails,
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

  res.status(200).json({
    c: 200,
    m: "Order fetched successfully",
    d: order,
  });
});

module.exports = {
  createOrder,
  getOrderById,
};
