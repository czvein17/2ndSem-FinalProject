const { asyncHandler } = require("../middlewares/asyncHandler");
const userService = require("../services/userService");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAllUsers();
  res.status(200).json({ success: true, data: users });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  res.status(200).json({
    success: true,
    message: `User with ${userId} successfuly updated`,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const { id: userId } = req.params;

  res.status(200).json({
    success: true,
    message: `User with ${userId} successfuly deleted`,
  });
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
