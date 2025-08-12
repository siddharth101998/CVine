const mongoose = require('mongoose');

const FoodCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    foodType: { type: String, required: true }
});

module.exports = mongoose.model('FoodCategory', FoodCategorySchema);