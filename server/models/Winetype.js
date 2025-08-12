const mongoose = require('mongoose');

const WineTypeSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('WineType', WineTypeSchema);