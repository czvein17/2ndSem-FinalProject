const orderService = require("../services/orderService");
const productService = require("../services/productService");
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const createOrder = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { orderItems, modeOfPayment } = req.body;

  const orderItemsDetails = [];
  let totalAmount = 0;

  for (const item of orderItems) {
    const { productId, quantity } = item;
    const product = await productService.getProductById(productId);

    if (!product) {
      return next(
        new ErrorResponse(404, `Product not found with id ${productId}`)
      );
    }

    console.log(product);

    const itemTotal = product.price * quantity;
    totalAmount += itemTotal;

    orderItemsDetails.push({
      product: product._id,
      quantity,
      price: product.price * quantity,
    });
  }

  const payload = {
    user: user.id,
    orderItems: orderItemsDetails,
    totalAmount,
    modeOfPayment,
  };

  const order = await orderService.createOrder(payload);

  res.status(201).json({
    c: 201,
    m: "Order created successfully",
    d: null,
  });
});

module.exports = {
  createOrder,
};
