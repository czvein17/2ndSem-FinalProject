const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");
const { openai } = require("../config/openai");

const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const findAllProducts = async (req) => {
  console.log(req.query);

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

  const prompt = `Based on the mood '${mood}', suggest a 5 coffees from the following options:\n\n`;
  const options = coffees
    .map((coffee) => `- ${coffee.name}: ${coffee.moodTags.join(", ")}`)
    .join("\n");
  const fullPrompt = `${prompt} ${options}`;

  console.log(prompt + options);

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
    response_format: zodResponseFormat(responseFormat, "json_schema"),
  });

  const suggestion = response.choices[0].message.content.trim();
  const parsedSuggestions = JSON.parse(suggestion);

  return parsedSuggestions;
};

const findProductsByNames = async (names) => {
  const products = await Product.find({ name: { $in: names } });
  return products;
};

module.exports = {
  findAllProducts,
  recomendProductsByMood,
  findProductsByNames,
};
