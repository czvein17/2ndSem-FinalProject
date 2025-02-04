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

module.exports = {
  createSale,
  getSales,
  getSaleById,
  findSaleByOrderId,
};
