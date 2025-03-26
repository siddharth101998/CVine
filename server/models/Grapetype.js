const mongoose = require('mongoose');

const GrapeTypeSchema = new mongoose.Schema({
    typeid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('GrapeType', GrapeTypeSchema);