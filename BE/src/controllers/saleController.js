const salesService = require("../services/salesService");
const orderService = require("../services/orderService");

const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const createSale = asyncHandler(async (req, res, next) => {
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

const getSales = asyncHandler(async (req, res, next) => {
  const sales = await salesService.getSales(req);
  res.status(200).json({
    c: 200,
    l: sales.length,
    m: "Get sales successfully",
    d: sales,
  });
});

const getSaleById = asyncHandler(async (req, res, next) => {
  const { salesId } = req.params;
  const sale = await salesService.getSaleById(salesId);

  if (!sale) {
    return next(new ErrorResponse(404, `Sale not found with id ${salesId}`));
  }

  res.status(200).json({
    c: 200,
    m: "Get sale by id successfully",
    d: sale,
  });
});

const getProductSales = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const sale = await salesService.findProductSalesById(productId);

  if (!sale) {
    return next(
      new ErrorResponse(404, `Sale not found with product id ${productId}`)
    );
  }

  res.status(200).json({
    c: 200,
    m: "Get product sales successfully",
    d: sale,
  });
});

const getTopPreferredProducts = asyncHandler(async (req, res, next) => {
  const products = await salesService.getTopPreferredProducts();

  res.status(200).json({
    c: 200,
    m: "Top 5 best selling products ",
    d: products,
  });
});

const getTotalPurchase = asyncHandler(async (req, res, next) => {
  const totalPurchase = await salesService.getTotalPurchase();

  res.status(200).json({
    c: 200,
    m: "Total purchase",
    d: totalPurchase,
  });
});

const getTotalSales = asyncHandler(async (req, res, next) => {
  const totalSales = await salesService.getTotalSales();

  res.status(200).json({
    c: 200,
    m: "Total sales",
    d: totalSales,
  });
});

const getSalesData = asyncHandler(async (req, res, next) => {
  const { timeRange } = req.query;
  const salesData = await salesService.getSalesData(timeRange);

  res.status(200).json({
    c: 200,
    m: "Get sales data successfully",
    d: salesData,
  });
});

module.exports = {
  createSale,
  getSales,
  getSaleById,
  getProductSales,
  getTopPreferredProducts,
  getTotalPurchase,
  getTotalSales,
  getSalesData,
};
