const express = require('express');
const router = express.Router();
const recipeController = require('../controller/RecipeController');

// routes/recipeRoutes.js
router.get('/', recipeController.getAllRecipes);
router.post('/', recipeController.createRecipe);
router.post('/comment', recipeController.createComment);

// ─── Action routes ────────────────────────────
router.put('/like', recipeController.toggleLike);
router.put('/save', recipeController.toggleSave);      // ← add this in your controller
router.put('/dislike', recipeController.toggleDislike);

// ─── Fetch routes ────────────────────────────
router.get('/count/:id', recipeController.getRecipeCount);
router.get('/user/:id', recipeController.getRecipeByUserId);
router.get('/comment/:id', recipeController.getCommentsByRecipeId);  // ← add this

// ─── ID‐based CRUD (last) ─────────────────────
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;