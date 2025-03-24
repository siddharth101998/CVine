const Recipe = require('../models/Recipe'); // Import the Recipe model

// Create a new recipe
const createRecipe = async (req, res) => {
    try {
        const { ingredients, bottles, method, userName, expertRecommendation, byUserId } = req.body;

        const newRecipe = new Recipe({
            ingredients,
            bottles,
            method,
            userName,
            expertRecommendation,
            byUserId,
        });

        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error });
    }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error });
    }
};

// Update a recipe
const updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error });
    }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error });
    }
};

// Add a like to a recipe
const addLike = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error adding like', error });
    }
};

// Add a dislike to a recipe
const addDislike = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $inc: { dislikes: 1 } },
            { new: true }
        );
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error adding dislike', error });
    }
};

// Add a comment to a recipe
const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: comment } },
            { new: true }
        );
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    addLike,
    addDislike,
    addComment
};
