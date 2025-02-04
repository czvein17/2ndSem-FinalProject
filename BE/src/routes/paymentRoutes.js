const express = require("express");

const {
  payWithPayMaya,
  confirmPayment,
} = require("../controllers/PaymentController");

const router = express.Router();

router.post("/maya/:orderId", payWithPayMaya);
router.get("/maya-confirm/:checkoutId", confirmPayment);

module.exports = router;
