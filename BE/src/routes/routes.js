const express = require("express");

const signinRoutes = require("./signinRoutes");
const signupRoutes = require("./signupRoutes");
const userRoutes = require("./userRoutes");

const chatBotRoutes = require("./chatBotRoutes");
const productRoutes = require("./productRoutes");
const ingredientRoutes = require("./ingredientRoutes");
const reviewRoutes = require("./reviewRoutes");
const orderRoutes = require("./orderRoutes");
const salesRoutes = require("./salesRoutes");

const paymentRoutes = require("./paymentRoutes");
const router = express.Router();

router.use("/signin", signinRoutes);
router.use("/signup", signupRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatBotRoutes);
router.use("/products", productRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/reviews", reviewRoutes);
router.use("/orders", orderRoutes);
router.use("/sales", salesRoutes);

router.use("/payment", paymentRoutes);

module.exports = router;
