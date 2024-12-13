const { jwtDecode } = require("jwt-decode");
const ErrorResponse = require("../utils/ErrorResponse");

const userService = require("./userService");

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
  const googleId = req.body?.userInfo?.id;

  if (email) user = await userService.findUserByEmail(email);
  else if (googleId) user = await userService.findUserByGoogleId(googleId);

  if (!user) {
    user = await userService.createUserViaGoogle({
      firstName,
      lastName,
      email,
      googleId,
    });
  }

  return user;
};

module.exports = {
  loginEmailAndPassword,
  loginViaGoogle,
};
