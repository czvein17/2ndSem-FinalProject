const express = require("express");
const {
  sendOTPToEmail,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOTPToEmail);
router.post("/verify-otp/:otp", verifyOTP);
router.post("/reset-password/:otp", resetPassword);

module.exports = router;
