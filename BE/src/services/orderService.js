const Order = require("../models/Order");

const createOrder = async (payload) => {
  const order = await Order.create(payload);
  return order;
};

const findAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

const findOrderById = async (id) => {
  const order = await Order.findById(id);
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
