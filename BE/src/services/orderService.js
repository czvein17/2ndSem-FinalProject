const Order = require("../models/Order");
const APIFeatures = require("../utils/apiFeatures");

const createOrder = async (payload) => {
  const order = await Order.create(payload);
  return order;
};

const findAllOrders = async (req) => {
  const features = new APIFeatures(Order.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query.populate({
    path: "sales",
  });
  return orders;
};

const findOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate({
      // path: "",
      path: "orderItems.product",
      select: "name price image",
    })
    .populate({
      path: "sales",
    });
  return order;
};

const updateOrder = async (id, payload) => {
  const order = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return order;
};

const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order;
};

module.exports = {
  createOrder,
  findAllOrders,
  findOrderById,
  updateOrder,
  deleteOrder,
};
