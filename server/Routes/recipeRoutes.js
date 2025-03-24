const express = require('express');
const router = express.Router();
const recipeController = require('../controller/RecipeController');


// Define routes and link them to controller functions
router.post('/recipes', recipeController.createRecipe); // Create a new recipe
router.get('/recipes', recipeController.getAllRecipes); // Get all recipes
router.get('/recipes/:id', recipeController.getRecipeById); // Get recipe by ID
router.put('/recipes/:id', recipeController.updateRecipe); // Update a recipe
router.delete('/recipes/:id', recipeController.deleteRecipe); // Delete a recipe
router.put('/recipes/:id/like', recipeController.addLike); // Add a like to a recipe
router.put('/recipes/:id/dislike', recipeController.addDislike); // Add a dislike to a recipe
router.put('/recipes/:id/comment', recipeController.addComment); // Add a comment to a recipe

module.exports = router;
