const Supplier = require("../models/Supplier");

const createSupplier = async (payload) => {
  const newSupplier = await Supplier.create(payload);
  return newSupplier;
};

const getAllSupplier = async () => {
  const suppliers = await Supplier.find();
  return suppliers;
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findById(id);

  if (!supplier) throw new Error("Supplier not found");

  return supplier;
};

const updateSupplier = async (id, payload) => {
  const updatedSupplier = await Supplier.findByIdAndUpdate(id, payload);

  if (!updatedSupplier) throw new Error("Supplier not found");

  return updatedSupplier;
};

const deleteSupplier = async (id) => {
  const deletedSupplier = await Supplier.findByIdAndDelete(id);

  if (!deletedSupplier) throw new Error("Supplier not found");

  return deletedSupplier;
};

module.exports = {
  createSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
