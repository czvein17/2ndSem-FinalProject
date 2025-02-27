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

module.exports = {
  getAllSupplier,
};
