const express = require("express");

const signinRoutes = require("./signinRoutes");
const signupRoutes = require("./signupRoutes");
const userRoutes = require("./userRoutes");
const chatBotRoutes = require("./chatBotRoutes");
const productRoutes = require("./productRoutes");
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

router.use("/signin", signinRoutes);
router.use("/signup", signupRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatBotRoutes);
router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
