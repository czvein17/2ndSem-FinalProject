const express = require("express");
const { createReview } = require("../controllers/reviewController");
const { protectAuth } = require("../middlewares/protectAuth");

const router = express.Router();

router.use(protectAuth);
router.post("/:productId", createReview);

module.exports = router;
