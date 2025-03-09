const mongoose = require("mongoose");
const Ingredient = require("./Ingredient");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    prices: {
      small: {
        type: Number,
        required: true,
      },
      medium: {
        type: Number,
        required: true,
      },
      large: {
        type: Number,
        required: true,
      },
    },
    category: {
      type: String,
      enum: ["Coffee", "Tea", "Juice"],
      default: "Coffee",
      required: true,
    },
    moodTags: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
    },
    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          small: {
            type: Number,
            required: true,
          },
          medium: {
            type: Number,
            required: true,
          },
          large: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    availability: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

ProductSchema.pre("save", async function (next) {
  const product = this;

  for (const ingredient of product.ingredients) {
    const ingredientData = await Ingredient.findById(ingredient.ingredient);
    if (
      !ingredientData ||
      ingredientData.stock < ingredient.quantity.small ||
      ingredientData.stock < ingredient.quantity.medium ||
      ingredientData.stock < ingredient.quantity.large
    ) {
      product.availability = "not available";
      return next();
    }
  }

  product.availability = "available";
  next();
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
