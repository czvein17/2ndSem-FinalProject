const { asyncHandler } = require("../middlewares/asyncHandler");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");

const signUpUsingEmailAndPassword = asyncHandler(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.getSignedToken(user, res);

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: user,
    token,
  });
});

module.exports = {
  signUpUsingEmailAndPassword,
};
