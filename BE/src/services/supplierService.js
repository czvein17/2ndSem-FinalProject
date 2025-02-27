const Supplier = require("../models/Supplier");

const createSupplier = async (payload) => {
  console.log(payload);
  const newSupplier = Supplier.create(payload);
  return newSupplier;
};

const getAllSupplier = async () => {
  const suppliers = Supplier.find();
  return suppliers;
};

module.exports = {
  createSupplier,
  getAllSupplier,
};
