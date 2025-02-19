const Ingredient = require("../models/Ingredient");
const mongoose = require("mongoose");

const findAllIngredients = async () => {
  const ingredients = await Ingredient.find();
  return ingredients;
};

const findIngredientById = async (id) => {
  const ingredient = await Ingredient.findById(id);
  return ingredient;
};

const createIngredient = async (ingredient) => {
  const newIngredient = Ingredient.create(ingredient);
  return newIngredient;
};

const updateIngredient = async (id, ingredient) => {
  const updatedIngredient = await Ingredient.findByIdAndUpdate(id, ingredient, {
    new: true,
    runValidators: true,
  });

  return updatedIngredient;
};

const updateIngredientStock = async (ingredientId, quantityChange) => {
  const ingredient = await findIngredientById(ingredientId);

  if (!ingredient) {
    throw new Error(`Ingredient not found with id ${ingredientId}`);
  }
  
  ingredient.stock += quantityChange;
  if (ingredient.stock < 0) {
    throw new Error(
      `Insufficient stock for ingredient with id ${ingredientId}`
    );
  }

  ingredient.stock = parseFloat(ingredient.stock.toFixed(2));

  await ingredient.save();
};

const deleteIngredient = async (id) => {
  const deletedIngredient = await Ingredient.findByIdAndDelete(id);
  return deletedIngredient;
};

module.exports = {
  findAllIngredients,
  findIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  updateIngredientStock,
};
