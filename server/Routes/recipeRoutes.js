const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');

// Static routes first
router.get('/', recipeController.getAllRecipes);        // Get all recipes
router.post('/', recipeController.createRecipe);          // Create a new recipe
router.post('/comment', recipeController.createComment);  // Create a comment for a recipe
router.put('/:id', recipeController.updateRecipe);        // Update a recipe
router.delete('/:id', recipeController.deleteRecipe);     // Delete a recipe
router.put('/like', recipeController.toggleLike);        // Add a like to a recipe
router.put('/dislike', recipeController.toggleDislike);  // Add a dislike to a recipe
router.get('/count/:id', recipeController.getRecipeCount);      // Get like count for a recipe
router.get('/user/:id', recipeController.getRecipeByUserId);        // Get all recipes by user
// Optional dynamic routes (place these after static routes to avoid conflicts)
// router.get('/:id', recipeController.getRecipeById);       // Get recipe by ID
// router.put('/:id', recipeController.updateRecipe);        // Update a recipe
// router.delete('/:id', recipeController.deleteRecipe);     // Delete a recipe
// router.put('/:id/comment', recipeController.addComment);  // Add a comment to a recipe

module.exports = router;