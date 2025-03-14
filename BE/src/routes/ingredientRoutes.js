const express = require("express");

const {
  createIngredient,
  findAllIngredients,
  findIngredientById,
  alertLowIngredientsStock,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingredientController");

const { uploadImage } = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .get(findAllIngredients)
  .post(uploadImage("ingredients-image"), createIngredient);

router.route("/low-stock").get(alertLowIngredientsStock);

router
  .route("/:id")
  .get(findIngredientById)
  .patch(updateIngredient)
  .delete(deleteIngredient);

module.exports = router;
