const Order = require("../models/Order");
const Sales = require("../models/Sales");
const APIFeatures = require("../utils/apiFeatures");

const createSale = async (payload) => {
  const sale = await Sales.create(payload);
  return sale;
};

const getSales = async (req) => {
  const features = new APIFeatures(Sales.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const sales = await features.query.populate("user").populate("order");
  return sales;
};

const getSaleById = async (id) => {
  const sale = await Sales.findById(id).populate("user").populate("order");
  return sale;
};

const findSaleByOrderId = async (orderId) => {
  const sale = await Sales.findOne({ order: orderId }).populate("order");
  return sale;
};

const findProductSalesById = async (productId) => {
  // Find orders that contain the specified product
  const orders = await Order.find({
    orderItems: { $elemMatch: { product: productId } },
  });

  // Extract order IDs from the found orders
  const orderIds = orders.map((order) => order._id);

  // Find sales associated with the found orders
  const sales = await Sales.find({
    order: { $in: orderIds },
    paymentStatus: "paid",
  }).populate({
    path: "order",
    // select: "totalAmount",
  });

  // Filter the orderItems array within each order to only include the specified product
  const filteredSales = sales.map((sale) => {
    const filteredOrderItems = sale.order.orderItems.filter(
      (item) => item.product.toString() === productId.toString()
    );
    return {
      ...sale.toObject(),
      order: {
        ...sale.order.toObject(),
        orderItems: filteredOrderItems,
      },
    };
  });

  // Aggregate sales data by day
  const salesByDay = {};

  filteredSales.forEach((sale) => {
    const saleDate = new Date(sale.createdAt).toISOString().split("T")[0]; // Get the date part only

    if (!salesByDay[saleDate]) {
      salesByDay[saleDate] = {
        totalSales: 0,
        orderCount: 0,
        totalQuantity: 0,
      };
    }

    sale.order.orderItems.forEach((item) => {
      salesByDay[saleDate].totalSales += item.price * item.quantity;
      salesByDay[saleDate].totalQuantity += item.quantity;
    });

    salesByDay[saleDate].orderCount += 1;
  });

  // Convert the aggregated data to an array format
  const result = Object.keys(salesByDay).map((date) => ({
    date,
    totalSales: salesByDay[date].totalSales,
    orderCount: salesByDay[date].orderCount,
    totalQuantity: salesByDay[date].totalQuantity,
  }));

  return result;
};

const getTopPreferredProducts = async () => {
  // Aggregate sales data to find the top preferred products based on total quantity ordered
  const topPreferredProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalQuantity: { $sum: "$orderItems.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
    { $limit: 3 }, // Limit to top 5 preferred products
    {
      $project: {
        _id: 0,
        productName: "$product.name",
        totalQuantity: 1,
      },
    },
  ]);

  return topPreferredProducts;
};

const updateSales = async (id, payload) => {
  const sale = await Sales.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return sale;
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  findSaleByOrderId,
  findProductSalesById,
  getTopPreferredProducts,
  updateSales,
};
