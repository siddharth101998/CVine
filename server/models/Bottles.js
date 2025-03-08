const BottleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wineType: { type: String, required: true },
    brandWinery: { type: String, required: true },
    price: { type: Number, required: true },
    avgRating: { type: Number, default: 0 },
    imageUrl: { type: String },
    fullDescription: { type: String },
    region: { type: String },
    foodPairings: { type: String },
    grapeType: { type: String },
    country: { type: String },
    alcoholContent: { type: String },
    boldness: { type: Object }
});

module.exports = mongoose.model('Bottle', BottleSchema);