const Ingredient = require("../models/Ingredient");

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
};
