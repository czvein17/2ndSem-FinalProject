const express = require("express");
const router = express.Router();

const {
  getSales,
  getSaleById,
  createSale,
} = require("../controllers/saleController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);
router.get("/", getSales);
router.get("/:salesId", getSaleById);

router.post("/cash/:orderId", createSale);

module.exports = router;
