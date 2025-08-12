const mongoose = require('mongoose');


const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: Object, required: true },
    bottles: { type: Object },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    expertRecommendation: { type: Boolean, default: false },
    method: { type: String },
    byUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    imageUrl: { type: String },
    likedusers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedusers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedusers:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

module.exports = mongoose.model('Recipe', RecipeSchema);