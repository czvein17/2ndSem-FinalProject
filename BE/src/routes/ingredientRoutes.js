const express = require("express");

const {
  createIngredient,
  findAllIngredients,
  findIngredientById,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingredientController");

const { uploadImage } = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .get(findAllIngredients)
  .post(uploadImage("ingredients-image"), createIngredient);

router
  .route("/:id")
  .get(findIngredientById)
  .patch(updateIngredient)
  .delete(deleteIngredient);

module.exports = router;
