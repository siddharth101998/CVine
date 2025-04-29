const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bottle: { type: mongoose.Schema.Types.ObjectId, ref: 'Bottle' },
    createdat: { type: Date, default: Date.now }

});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);