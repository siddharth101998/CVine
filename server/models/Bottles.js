const mongoose = require('mongoose');

const BottleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wineType: { type: String, required: true },
    Winery: { type: String, required: true },
    price: { type: String, required: true },
    avgRating: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    fullDescription: { type: String },
    region: { type: String },
    foodPairings: { type: String },
    grapeType: { type: String },
    country: { type: String, required: true },
    alcoholContent: { type: String },
    boldness: { type: Object },
    viewcount: { type: Number, default: 0 }
});

// Index for faster queries on the 'name' field (if needed for sorting or queries)
BottleSchema.index({ name: 1 });

// Compound index for filter fields used in search (adjust the order based on selectivity)
BottleSchema.index({ country: 1, wineType: 1, grapeType: 1, region: 1 });

module.exports = mongoose.model('Bottle', BottleSchema);