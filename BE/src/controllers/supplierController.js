const supplierService = require("../services/supplierService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const getAllSupplier = asyncHandler(async (req, res, next) => {
  const suppliers = await supplierService.getAllSupplier();

  res.status(200).json({
    c: 200,
    m: "Get all suppliers successfully",
    d: suppliers,
  });
});

const createSupplier = asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    address: req.body.address,
  };

  const newSupplier = await supplierService.createSupplier(payload);

  res.status(201).json({
    c: 201,
    m: "Supplier created successfully",
    d: newSupplier,
  });
});

const getSupplierById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const supplier = await supplierService.getSupplierById(id);

  res.status(200).json({
    c: 200,
    m: "Get supplier by id successfully",
    d: supplier,
  });
});

const updateSupplier = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const payload = {
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    address: req.body.address,
  };

  const updatedSupplier = await supplierService.updateSupplier(id, payload);

  res.status(200).json({
    c: 200,
    m: "Supplier updated successfully",
    d: updatedSupplier,
  });
});

const deleteSupplier = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const deletedSupplier = await supplierService.deleteSupplier(id);

  res.status(200).json({
    c: 200,
    m: "Supplier deleted successfully",
    d: null,
  });
});

module.exports = {
  getAllSupplier,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
