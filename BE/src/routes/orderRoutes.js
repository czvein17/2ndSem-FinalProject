const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");

const { protectAuth } = require("../middlewares/protectAuth");

router.post("/", protectAuth, createOrder);

module.exports = router;
