const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");
const { openai } = require("../config/openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const createProduct = async (product) => {
  const newProduct = await Product.create(product);
  return newProduct;
};

const findAllProducts = async (req) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  return products;
};

const recomendProductsByMood = async (mood) => {
  const coffees = await Product.find();

  const prompt = `Based on the mood '${mood}', suggest a 3 coffees from the following options:\n\n`;
  const options = coffees
    .map((coffee) => `- ${coffee.name}: ${coffee.moodTags.join(", ")}`)
    .join("\n");
  const fullPrompt = `${prompt} ${options}`;

  const responseFormat = z.object({
    data: z.array(
      z.object({
        name: z.string(),
        explanation: z.string(),
      })
    ),
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: fullPrompt }],
    max_tokens: 500,
    response_format: zodResponseFormat(responseFormat, "coffee-suggestion"),
  });

  console.log(response.choices[0].message);

  const suggestion = response.choices[0].message.content.trim();
  const parsedSuggestions = JSON.parse(suggestion);

  return parsedSuggestions;
};

const findProductsByNames = async (names) => {
  const products = await Product.find({ name: { $in: names } });
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate({
      path: "reviews",
      select: "user rating review -product",
    })
    .populate({
      path: "ingredients.ingredient",
    });
  return product;
};

const updateProductAvailability = async () => {
  const products = await Product.find().populate("ingredients.ingredient");

  for (const product of products) {
    let available = true;

    for (const ingredient of product.ingredients) {
      const ingredientData = await Ingredient.findById(
        ingredient.ingredient._id
      );
      if (
        !ingredientData ||
        ingredientData.stock < ingredient.quantity.small ||
        ingredientData.stock < ingredient.quantity.medium ||
        ingredientData.stock < ingredient.quantity.large
      ) {
        available = false;
        break;
      }
    }

    product.availability = available ? "available" : "not available";
    await product.save();
  }
};

module.exports = {
  createProduct,
  findAllProducts,
  recomendProductsByMood,
  findProductsByNames,
  getProductById,
  updateProductAvailability,
};
