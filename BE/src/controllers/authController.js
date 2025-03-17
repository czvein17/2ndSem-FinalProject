const authServices = require("../services/authService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const sendOTPToEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authServices.sendOTPToEmail(email);

  res.status(200).json({
    c: 200,
    m: "OTP sent to email",
    d: null,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.params;
  const { email } = req.body;

  const user = await authServices.verifyOTP(email, otp);

  res.status(200).json({
    c: 200,
    m: "OTP verified successfully",
    d: user,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { otp } = req.params;
  const { email, newPassword } = req.body;

  await authServices.resetPassword(otp, email, newPassword);

  res.status(200).json({
    c: 200,
    m: "Password reset successfully",
    d: null,
  });
});

module.exports = {
  sendOTPToEmail,
  verifyOTP,
  resetPassword,
};
