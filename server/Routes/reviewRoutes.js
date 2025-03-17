const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  addReview,
  deleteReview,
  editReview,
} = require("../controller/ReviewController");

router.get("/", getAllReviews);
router.post("/", addReview);
router.delete("/", deleteReview);
router.put("/", editReview);
module.exports = router;
