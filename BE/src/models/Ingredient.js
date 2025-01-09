const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["g", "kg", "ml", "l", "pcs"],
    required: true,
    default: "pcs",
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);
module.exports = Ingredient;
