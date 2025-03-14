const mongoose = require('mongoose');

const BottleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wineType: { type: String, required: true },
    Winery: { type: String, required: true },
    price: { type: String, required: true },
    avgRating: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    fullDescription: { type: String, },
    region: { type: String },
    foodPairings: { type: String },
    grapeType: { type: String },
    country: { type: String, required: true },
    alcoholContent: { type: String, },
    boldness: { type: Object }
});

module.exports = mongoose.model('Bottle', BottleSchema);