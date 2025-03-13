const express = require("express");

const {
  payWithPayMaya,
  confirmPayment,
  payWithCash,
  debugMaya,
} = require("../controllers/PaymentController");
const { protectAuth } = require("../middlewares/protectAuth");

const router = express.Router();

router.use(protectAuth);
router.post("/cash/:orderId", payWithCash);
router.post("/maya/:orderId", payWithPayMaya);
router.get("/maya-confirm/:orderId", confirmPayment);

router.get("/debug-maya/:checkoutId", debugMaya);

module.exports = router;
