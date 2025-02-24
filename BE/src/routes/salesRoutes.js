const express = require("express");
const router = express.Router();

const {
  getSales,
  getSaleById,
  createSale,
  getProductSales,
  getTopPreferredProducts,
} = require("../controllers/saleController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);
router.get("/", getSales);

router.get("/best-preferred-products", getTopPreferredProducts);
router.get("/:salesId", getSaleById);
router.get("/product/:productId", getProductSales);

router.post("/cash/:orderId", createSale);

module.exports = router;
