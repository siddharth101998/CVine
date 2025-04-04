const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  addReview,
  deleteReview,
  editReview,
} = require("../controller/ReviewController");

router.get("/:id", getAllReviews);
router.post("/", addReview);
router.delete("/:id", deleteReview);
router.put("/", editReview);
module.exports = router;
