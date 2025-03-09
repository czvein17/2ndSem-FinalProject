const express = require("express");

const {
  createProduct,
  findAllProducts,
  recomendProductsByMood,
  getProductById,
  deleteProduct,
} = require("../controllers/productController");
const { uploadImage } = require("../middlewares/upload");

const router = express.Router();

router.route("/").get(findAllProducts).post(recomendProductsByMood);
router.route("/create").post(uploadImage("coffee-image"), createProduct);
router.route("/:id").get(getProductById).delete(deleteProduct);

module.exports = router;
