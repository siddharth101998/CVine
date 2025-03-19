// controllers/recipeController.js
const Recipe = require("../models/Recipe");

// @desc    Create a new recipe
// @route   POST /recipes
// @access  Private (Authenticated users only)
const createRecipe = async (req, res) => {
    try {
        const { uid, name } = req.user; // Firebase UID and name (from decoded token)
        const { ingredients, bottles, method } = req.body;

        if (!ingredients || !bottles || !method) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newRecipe = new Recipe({
            ingredients,
            bottles,
            method,
            byUserId: uid, // Firebase UID
            userName: name
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Get all recipes
// @route   GET /recipes
// @access  Public
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("byUserId", "name");
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Get a recipe by ID
// @route   GET /recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Update a recipe
// @route   PUT /recipes/:id
// @access  Private (Only the owner can update)
const updateRecipe = async (req, res) => {
    try {
        const { uid } = req.user; // Get user UID from the decoded token
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Only allow the owner of the recipe to update it
        if (recipe.byUserId !== uid) {
            return res.status(401).json({ message: "Unauthorized to update this recipe" });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Delete a recipe
// @route   DELETE /recipes/:id
// @access  Private (Only the owner can delete)
const deleteRecipe = async (req, res) => {
    try {
        const { uid } = req.user; // Get user UID from the decoded token
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Only allow the owner of the recipe to delete it
        if (recipe.byUserId !== uid) {
            return res.status(401).json({ message: "Unauthorized to delete this recipe" });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Like a recipe
// @route   POST /recipes/:id/like
// @access  Private
const likeRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.likes += 1;
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Dislike a recipe
// @route   POST /recipes/:id/dislike
// @access  Private
const dislikeRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.dislikes += 1;
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Add a comment to a recipe
// @route   POST /recipes/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.comments.push(comment);
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    dislikeRecipe,
    addComment
};
