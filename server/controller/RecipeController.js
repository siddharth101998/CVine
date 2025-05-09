const Recipe = require('../models/Recipe'); // Import the Recipe model
const RecipeComment = require('../models/Recipecomment');
// Create a new recipe
const createRecipe = async (req, res) => {
    try {
        console.log("recipe created started", req.body);
        const { name, ingredients, bottles, method, userName, byUserId,imageUrl } = req.body;

        const newRecipe = new Recipe({
            name,
            ingredients,
            bottles,
            method,
            userName,
            imageUrl,
            byUserId,
        });

        const savedRecipe = await newRecipe.save();
        console.log("recipe created", savedRecipe);
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.log("Error creating recipe:", error);
        res.status(500).json({ message: 'Error creating recipe', error });
    }
};

const getRecipeCount = async (req, res) => {
    try {
        const count = await Recipe.countDocuments({byUserId: req.params.id});
        if (count === 0) {
            return res.status(200).json({ message: 'No recipes found for this user' ,count});
        }
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe count', error });
    }
}

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        console.log("fetch recipe started")
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

const getRecipeByUserId = async (req, res) => {
    try {
        const recipes = await Recipe.find({ byUserId: req.params.id });
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for this user' });
        }
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
}

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

// Toggling like
const toggleLike = async (req, res) => {
    try {
        const { recipeId, userId } = req.body;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const alreadyLiked = recipe.likedusers.includes(userId);
        const alreadyDisliked = recipe.dislikedusers.includes(userId);

        // If the user already liked, remove them from likedusers (unlike)
        if (alreadyLiked) {
            recipe.likedusers.pull(userId);
            if (recipe.likes > 0) recipe.likes -= 1;
        } else {
            // If user was in dislikedusers, remove them
            if (alreadyDisliked) {
                recipe.dislikedusers.pull(userId);
                if (recipe.dislikes > 0) recipe.dislikes -= 1;
            }
            // Add user to likedusers
            recipe.likedusers.push(userId);
            recipe.likes += 1;
        }

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error });
    }
};

// Toggling dislike
const toggleDislike = async (req, res) => {
    try {
        const { recipeId, userId } = req.body;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const alreadyLiked = recipe.likedusers.includes(userId);
        const alreadyDisliked = recipe.dislikedusers.includes(userId);

        // If the user already disliked, remove them from dislikedusers (undislike)
        if (alreadyDisliked) {
            recipe.dislikedusers.pull(userId);
            if (recipe.dislikes > 0) recipe.dislikes -= 1;
        } else {
            // If user was in likedusers, remove them
            if (alreadyLiked) {
                recipe.likedusers.pull(userId);
                if (recipe.likes > 0) recipe.likes -= 1;
            }
            // Add user to dislikedusers
            recipe.dislikedusers.push(userId);
            recipe.dislikes += 1;
        }

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling dislike', error });
    }
};

// Toggling save/bookmark
const toggleSave = async (req, res) => {
  console.log('toggleSave called with:', req.body);
  try {
    const { recipeId, userId } = req.body;
    const recipe = await Recipe.findById(recipeId);
    console.log('Recipe before toggleSave:', recipe);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const alreadySaved = recipe.savedusers.includes(userId);
    if (alreadySaved) {
      recipe.savedusers.pull(userId);
    } else {
      recipe.savedusers.push(userId);
    }
    const updatedRecipe = await recipe.save();
    console.log('Recipe after toggleSave:', updatedRecipe);
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error toggling save:', error);
    res.status(500).json({ message: 'Error toggling save', error });
  }
};

// Add a comment to a recipe
// const addComment = async (req, res) => {
//     try {
//         const { comment } = req.body;
//         const recipe = await Recipe.findByIdAndUpdate(
//             req.params.id,
//             { $push: { comments: comment } },
//             { new: true }
//         );
//         if (!recipe) {
//             return res.status(404).json({ message: 'Recipe not found' });
//         }
//         res.status(200).json(recipe);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding comment', error });
//     }
// };
const createComment = async (req, res) => {
    try {
        console.log("comment started", req.body)
        // Destructure th
        // e required fields from the request body
        const { recipeId, userId, userName, comment } = req.body;
        const newComment = new RecipeComment({ recipeId, userId, userName, comment });
        const savedComment = await newComment.save();
        
        res.status(201).json(savedComment);
    } catch (error) {
        console.log("Error creating comment:", error);
        res.status(500).json({ message: 'Error creating comment', error });
    }
};

// Get all comments for a specific recipe by recipeId
const getCommentsByRecipeId = async (req, res) => {
    try {
        const recipeId  = req.params.id;
        console.log("recipeId", recipeId);
        const comments = await RecipeComment
          .find({ recipeId })
          .populate({ path: 'userId', select: 'userName username name' });
        const formatted = comments.map(c => ({
          _id: c._id,
          recipeId: c.recipeId,
          comment: c.comment,
          userId: c.userId._id,
          commenterName: c.userId.userName || c.userId.username || c.userId.name || 'Anonymous',
          createdAt: c.createdAt
        }));
        res.status(200).json(formatted);
    } catch (error) {
        console.log("Error fetching comments:", error);
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Delete a comment by its comment id, and remove its reference from the Recipe.comments array
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the comment to know which recipe it belongs to
        const comment = await RecipeComment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Delete the comment document
        await RecipeComment.findByIdAndDelete(id);
        // Remove reference from Recipe.comments array, if schema tracks it
        await Recipe.findByIdAndUpdate(
            comment.recipeId,
            { $pull: { comments: id } }
        );
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

const getSavedRecipes = async (req, res) => {
    try {
      const userId = req.params.id;
      const recipes = await Recipe.find({ savedusers: userId });
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      res.status(500).json({ message: 'Error fetching saved recipes', error });
    }
  };




module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    toggleDislike,
    toggleLike,
    toggleSave,
    createComment,
    getCommentsByRecipeId,
    deleteComment,getRecipeCount,getRecipeByUserId,
    getSavedRecipes,
};
