const { asyncHandler } = require("../middlewares/asyncHandler");
const userService = require("../services/userService");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAllUsers();
  res.status(200).json({ success: true, data: users });
});

module.exports = {
  getAllUsers,
};
