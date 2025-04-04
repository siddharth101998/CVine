const mongoose = require('mongoose');

const BottleViewSchema = new mongoose.Schema({
    bottleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bottle', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewCount: { type: Number, default: 0 },
    bottlename: { type: String, default: "" }
});

module.exports = mongoose.model('BottleView', BottleViewSchema);