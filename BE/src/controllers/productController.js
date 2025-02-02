const productService = require("../services/productService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    moodTags: req.body.moodTags,
    image: req.body.image,
    ingredients: req.body.ingredients,
  };

  const product = await productService.createProduct(payload);

  res.json({
    c: 200,
    m: null,
    d: product,
  });
});

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

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({
    c: 200,
    m: null,
    d: product,
  });
});

module.exports = {
  createProduct,
  findAllProducts,
  recomendProductsByMood,
  getProductById,
};
