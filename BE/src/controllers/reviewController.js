const reviewService = require("../services/reviewService");
const { asyncHandler } = require("../middlewares/asyncHandler");

const createReview = asyncHandler(async (req, res, next) => {
  const payload = {
    user: req.user.id,
    product: req.params.productId,
    rating: req.body.rating,
    review: req.body.review,
  };

  const newReview = await reviewService.createReview(payload);

  res.send({
    c: 201,
    m: "Review created",
    d: newReview,
  });
});

module.exports = {
  createReview,
};
