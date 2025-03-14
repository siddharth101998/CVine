const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    searchType: { type: String },
    filter: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);