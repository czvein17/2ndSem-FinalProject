const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
} = require("../controllers/orderController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:id").get(getOrderById).patch(updateOrder);

module.exports = router;
