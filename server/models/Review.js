
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    bottleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bottle', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    username: { type: String, required: true },
});

module.exports = mongoose.model('Review', ReviewSchema);