const express = require("express");
const { protectAuth, restrictTo } = require("../middlewares/protectAuth");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(protectAuth, restrictTo("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").patch(updateUser).delete(deleteUser);

module.exports = router;
