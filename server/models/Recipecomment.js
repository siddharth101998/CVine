
const mongoose = require('mongoose');
const RecipecommentSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },

});

module.exports = mongoose.model('Recipecomment', RecipecommentSchema);