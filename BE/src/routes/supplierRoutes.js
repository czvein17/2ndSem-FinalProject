const express = require("express");
const router = express.Router();

const { protectAuth } = require("../middlewares/protectAuth");

const {
  getAllSupplier,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

router.use(protectAuth);

router.route("/").get(getAllSupplier).post(createSupplier);

router
  .route("/:id")
  .get(getSupplierById)
  .patch(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;
