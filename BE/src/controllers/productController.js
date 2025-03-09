const productService = require("../services/productService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res, next) => {
  console.log(req.body); // Check request body
  console.log(req.file); // Check uploaded image

  let bodyData = req.body;

  // Check if the request is multipart/form-data (form-data)
  if (req.is("multipart/form-data") && req.body.data) {
    try {
      bodyData = JSON.parse(req.body.data); // Parse JSON string
    } catch (error) {
      return res
        .status(400)
        .json({ c: 400, m: "Invalid JSON format", d: null });
    }
  }

  const payload = {
    name: bodyData.name,
    description: bodyData.description,
    prices: bodyData.prices,
    category: bodyData.category,
    moodTags: bodyData.moodTags,
    image: req.file?.filename,
    ingredients: bodyData.ingredients,
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
    p: products.totalPages,
    d: products.products,
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

const deleteProduct = asyncHandler(async (req, res, next) => {
  await productService.deleteProduct(req.params.id);
  res.json({
    c: 200,
    m: null,
    d: null,
  });
});

module.exports = {
  createProduct,
  findAllProducts,
  recomendProductsByMood,
  getProductById,
  deleteProduct,
};
