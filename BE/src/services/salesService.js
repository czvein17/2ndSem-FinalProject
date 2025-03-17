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
    .paginate()
    .search();

  const sales = await features.query.populate("user").populate("order");
  return sales;
};

const getSaleById = async (id) => {
  const sale = await Sales.findById(id)
    .populate("user")
    .populate({
      path: "order",
      populate: {
        path: "orderItems.product",
        model: "Product",
      },
    });
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

const getLeastPreferredProducts = async () => {
  // Aggregate sales data to find the least preferred products based on total quantity ordered
  const leastPreferredProducts = await Order.aggregate([
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
    { $sort: { totalQuantity: 1 } }, // Sort by totalQuantity in ascending order
    { $limit: 3 }, // Limit to top 3 least preferred products
    {
      $project: {
        _id: 0,
        productName: "$product.name",
        totalQuantity: 1,
      },
    },
  ]);

  return leastPreferredProducts;
};

const getTotalPurchase = async () => {
  const totalPurchase = await Sales.countDocuments({ paymentStatus: "paid" });
  return totalPurchase;
};

const getTotalSales = async () => {
  const totalSales = await Sales.aggregate([
    {
      $match: { paymentStatus: "paid" },
    },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    {
      $unwind: "$order",
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$order.totalAmount" }, // Sum the totalAmount field from the order
      },
    },
  ]);

  return totalSales.length > 0 ? totalSales[0].totalSales : 0;
};

const getSalesData = async (timeRange) => {
  let matchCondition = { paymentStatus: "paid" };

  const now = new Date();

  if (timeRange === "last7days") {
    const last7Days = new Date(now.setDate(now.getDate() - 7));
    matchCondition.createdAt = { $gte: last7Days };
  } else if (timeRange === "lastMonth") {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    matchCondition.createdAt = { $gte: lastMonth };
  } else if (timeRange === "thisMonth") {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    matchCondition.createdAt = { $gte: firstDayOfMonth };
  }

  const salesData = await Sales.aggregate([
    { $match: matchCondition },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalSales: { $sum: "$order.totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return salesData;
};

const getSalesByStatus = async () => {
  const salesByStatus = await Sales.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  return salesByStatus;
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
  getLeastPreferredProducts,
  getTotalPurchase,
  getTotalSales,
  getSalesData,
  getSalesByStatus,
  updateSales,
};
