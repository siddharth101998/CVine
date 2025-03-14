const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bottles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bottle' }],

});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);