const express = require("express");

const {
  createIngredient,
  findAllIngredients,
  findIngredientById,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingredientController");

const router = express.Router();

router.route("/").get(findAllIngredients).post(createIngredient);

router
  .route("/:id")
  .get(findIngredientById)
  .patch(updateIngredient)
  .delete(deleteIngredient);

module.exports = router;
