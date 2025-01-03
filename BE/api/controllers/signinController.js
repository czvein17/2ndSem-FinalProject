const { asyncHandler } = require("../middlewares/asyncHandler");
const authServices = require("../services/authService");
const tokenService = require("../services/tokenService");

const loginEmailAndPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.loginEmailAndPassword(email, password);
  const token = await tokenService.getSignedToken(user, res);
  user.password = undefined;

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

const signAsGoogle = asyncHandler(async (req, res) => {
  const user = await authServices.loginViaGoogle(req);
  const token = await tokenService.getSignedToken(user, res);
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    data: user,
  });
});

module.exports = {
  loginEmailAndPassword,
  signAsGoogle,
};
