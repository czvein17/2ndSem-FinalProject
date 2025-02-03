const express = require("express");
const router = express.Router();
const { createOrder, getOrderById } = require("../controllers/orderController");

const { protectAuth } = require("../middlewares/protectAuth");

router.use(protectAuth);
router.post("/", createOrder);
router.route("/:id").get(getOrderById);

module.exports = router;
