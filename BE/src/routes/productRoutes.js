const express = require("express");

const {
  findAllProducts,
  recomendProductsByMood,
} = require("../controllers/productController");
const router = express.Router();

router.route("/").get(findAllProducts).post(recomendProductsByMood);

module.exports = router;
