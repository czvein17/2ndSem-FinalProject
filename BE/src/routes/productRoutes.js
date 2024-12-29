const express = require("express");

const {
  findAllProducts,
  recomendProductsByMood,
  getProductById,
} = require("../controllers/productController");
const router = express.Router();

router.route("/").get(findAllProducts).post(recomendProductsByMood);
router.route("/:id").get(getProductById);

module.exports = router;
