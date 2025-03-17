const { jwtDecode } = require("jwt-decode");
const ErrorResponse = require("../utils/ErrorResponse");
const userService = require("./userService");

const { sendOTPtoMail } = require("../utils/email");

const loginEmailAndPassword = async (email, password) => {
  const user = await userService.findUserByEmail(email);

  if (!user) throw new ErrorResponse(404, "No user found");
  else if (!(await user.isPasswordMatch(password)))
    throw new ErrorResponse(401, "Invalid password");

  return user;
};

const loginViaGoogle = async (req) => {
  let user;

  const firstName = req.body?.userInfo?.given_name;
  const lastName = req.body?.userInfo?.family_name;
  const email = req.body?.userInfo?.email;
  const fullName = firstName + " " + lastName;
  const googleId = req.body?.userInfo?.id;
  const googleProfilePic = req.body?.userInfo?.picture;

  if (email) user = await userService.findUserByEmail(email);
  else if (googleId) user = await userService.findUserByGoogleId(googleId);

  if (!user) {
    user = await userService.createUserViaGoogle({
      firstName,
      lastName,
      fullName,
      email,
      googleId,
      googleProfilePic,
    });
  }

  return user;
};

const sendOTPToEmail = async (email) => {
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await userService.findUserByEmail(email);

  if (!user) throw new ErrorResponse(404, "No user found");

  // Save OTP to user document
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await user.save();

  // Send OTP to email
  await sendOTPtoMail(email, otp);

  return;
};

const verifyOTP = async (email, otp) => {
  const user = await userService.findUserByEmail(email);

  if (!user) throw new ErrorResponse(404, "No user found");

  otp = parseInt(otp, 10);

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new ErrorResponse(400, "Invalid or expired OTP");
  }

  return user;
};

const resetPassword = async (otp, email, password) => {
  const user = await userService.findUserByEmail(email);

  if (!user) throw new ErrorResponse(404, "No user found");

  otp = parseInt(otp, 10);

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new ErrorResponse(400, "Invalid or expired OTP");
  }

  user.password = password;
  user.otp = undefined;
  user.otp;

  console.log(password);
  console.log(user);

  await user.save();

  return user;
};

module.exports = {
  loginEmailAndPassword,
  loginViaGoogle,
  sendOTPToEmail,
  verifyOTP,
  resetPassword,
};
