const express = require("express");
const router = express.Router();

const {
  getSales,
  getSaleById,
  createSale,
  getProductSales,
  getTopPreferredProducts,
  getTotalPurchase,
  getTotalSales,
  getSalesData,
} = require("../controllers/saleController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);
router.get("/", getSales);

router.get("/total-purchase", getTotalPurchase);
router.get("/total-sales", getTotalSales);
router.get("/sales-data", getSalesData);
router.get("/best-preferred-products", getTopPreferredProducts);
router.get("/:salesId", getSaleById);
router.get("/product/:productId", getProductSales);

router.post("/cash/:orderId", createSale);

module.exports = router;
