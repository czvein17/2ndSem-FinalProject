const express = require("express");
const router = express.Router();

const {
  getSales,
  getSaleById,
  createSale,
  getProductSales,
  getTopPreferredProducts,
  getLeastPreferredProducts,
  getTotalPurchase,
  getTotalSales,
  getSalesData,
  getSalesByStatus,
} = require("../controllers/saleController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);
router.get("/", getSales);

router.get("/total-purchase", getTotalPurchase);
router.get("/total-sales", getTotalSales);
router.get("/sales-by-status", getSalesByStatus);

router.get("/sales-data", getSalesData);
router.get("/best-preferred-products", getTopPreferredProducts);
router.get("/least-preferred-products", getLeastPreferredProducts);
router.get("/:salesId", getSaleById);
router.get("/product/:productId", getProductSales);

router.post("/cash/:orderId", createSale);

module.exports = router;
