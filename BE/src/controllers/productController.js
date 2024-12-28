const productService = require("../services/productService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const findAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.findAllProducts(req);
  res.json({
    c: 200,
    m: null,
    d: products,
  });
});

const recomendProductsByMood = asyncHandler(async (req, res) => {
  const { mood } = req.body;
  console.log(req.body);
  const suggestion = await productService.recomendProductsByMood(mood);

  const products = await productService.findProductsByNames(
    suggestion.data.map((s) => s.name)
  );

  // Add explanations to the products
  const productsWithExplanation = products.map((product) => {
    const explanation = suggestion.data.find(
      (s) => s.name === product.name
    ).explanation;
    return {
      ...product.toObject(),
      explanation,
    };
  });

  res.json({
    c: 200,
    m: null,
    d: productsWithExplanation,
  });
});

module.exports = { findAllProducts, recomendProductsByMood };
