const ingredientService = require("../services/ingredientService");
const supplierService = require("../services/supplierService");
const ErrorResponse = require("../utils/ErrorResponse");
const { emailSupplier } = require("../utils/email");

const { asyncHandler } = require("../middlewares/asyncHandler");

const findAllIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await ingredientService.findAllIngredients(req);

  res.status(200).json({
    c: 200,
    m: null,
    d: ingredients,
  });
});

const createIngredient = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);

  const payload = {
    name: req.body.name,
    stock: req.body.stock,
    unit: req.body.unit,
    lowStockThreshold: req.body.lowStockThreshold,
    supplier: req.body.supplier,
    image: req.file.filename,
  };

  const ingredient = await ingredientService.createIngredient(payload);

  res.status(201).json({
    c: 201,
    m: "Ingredient created successfully",
    d: ingredient,
  });
});

const findIngredientById = asyncHandler(async (req, res, next) => {
  const ingredient = await ingredientService.findIngredientById(req.params.id);

  if (!ingredient) {
    return next(new ErrorResponse(404, `Ingredient not found with that id`));
  }

  res.status(200).json({
    c: 200,
    m: null,
    d: ingredient,
  });
});

const alertLowIngredientsStock = asyncHandler(async (req, res, next) => {
  const lowStockIngredients =
    await ingredientService.alertLowIngredientsStock();

  res.status(200).json({
    c: 200,
    m: null,
    d: lowStockIngredients,
  });
});

const notifySupplier = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const ingredient = await ingredientService.findIngredientById(id);

  if (!ingredient) {
    return next(new ErrorResponse(404, `Ingredient not found with that id`));
  }

  await emailSupplier(ingredient);

  res.status(200).json({
    c: 200,
    m: "Supplier notified successfully",
    d: ingredient,
  });
});

const updateIngredient = asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    stock: req.body.stock,
    unit: req.body.unit,
    lowStockThreshold: req.body.lowStockThreshold,
    supplier: req.body.supplier,
  };

  const ingredient = await ingredientService.updateIngredient(
    req.params.id,
    payload
  );

  if (!ingredient) {
    return next(new ErrorResponse(404, `Ingredient not found with that id`));
  }

  res.status(200).json({
    c: 200,
    m: "Ingredient updated successfully",
    d: ingredient,
  });
});

const deleteIngredient = asyncHandler(async (req, res, next) => {
  await ingredientService.deleteIngredient(req.params.id);

  if (!ingredient) {
    return next(new ErrorResponse(404, `Ingredient not found with that id`));
  }

  res.status(200).json({
    c: 200,
    m: "Ingredient deleted successfully",
    d: null,
  });
});

module.exports = {
  findAllIngredients,
  createIngredient,
  findIngredientById,
  alertLowIngredientsStock,
  notifySupplier,
  updateIngredient,
  deleteIngredient,
};
