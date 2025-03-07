const RecipeSchema = new mongoose.Schema({
    ingredients: { type: Object, required: true },
    bottles: { type: Object, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{ type: String }],
    expertRecommendation: { type: Boolean, default: false },
    method: { type: String },
    byUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String }
});

module.exports = mongoose.model('Recipe', RecipeSchema);