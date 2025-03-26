const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  const { bottleId } = req.query;
  try {
    const reviews = await Review.find({ bottleId }).populate(
      "userId",
      "name email"
    );
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const addReview = async (req, res) => {
  try {
    const { bottleId, userId, reviewText, rating } = req.body;
    if (!bottleId || !userId || !reviewText || !rating) {
      return res.status(400).json({
        success: false,
        message: "Bottle ID, User ID, Review Text and Rating are required.",
      });
    }
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json({ success: true, data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    await review.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const editReview = async (req, res) => {
  try {
    const { reviewId, reviewText, rating } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    review.reviewText = reviewText;
    review.rating = rating;
    const savedReview = await review.save();
    res.status(200).json({ success: true, data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

module.exports = {
  getAllReviews,
  addReview,
  deleteReview,
  editReview,
};
