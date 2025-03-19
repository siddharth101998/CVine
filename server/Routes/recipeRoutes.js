// routes/recipeRoutes.js
const express = require("express");
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    dislikeRecipe,
    addComment,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Recipe routes
router.post("/", protect, createRecipe); // Create recipe (Protected)
router.get("/", getAllRecipes); // Get all recipes (Public)
router.get("/:id", getRecipeById); // Get recipe by ID (Public)
router.put("/:id", protect, updateRecipe); // Update recipe (Protected)
router.delete("/:id", protect, deleteRecipe); // Delete recipe (Protected)
router.post("/:id/like", protect, likeRecipe); // Like a recipe (Protected)
router.post("/:id/dislike", protect, dislikeRecipe); // Dislike a recipe (Protected)
router.post("/:id/comment", protect, addComment); // Add a comment (Protected)

module.exports = router;
