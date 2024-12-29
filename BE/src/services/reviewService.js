const Review = require("../models/Review");

const createReview = async (review) => {
  const newReview = Review.create(review);
  return newReview;
};

module.exports = {
  createReview,
};
