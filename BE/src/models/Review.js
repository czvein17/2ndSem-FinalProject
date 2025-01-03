const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
});

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "fullname email googleProfilePic ",
  });
  next();
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
