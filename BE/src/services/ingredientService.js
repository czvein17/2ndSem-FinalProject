const Ingredient = require("../models/Ingredient");
const APIFeatures = require("../utils/apiFeatures");

const findAllIngredients = async (req) => {
  const features = new APIFeatures(Ingredient.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const ingredients = await features.query;
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
