const WineTypeSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('WineType', WineTypeSchema);