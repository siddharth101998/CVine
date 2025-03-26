const mongoose = require('mongoose');

const wineRegionSchema = new mongoose.Schema({
    region: { type: String },
    country: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("WineRegion", wineRegionSchema);