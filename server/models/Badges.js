const mongoose = require('mongoose');

const badgesSchema = new mongoose.Schema({
    badgeLogo: { type: String, required: true },
    badgeCondition: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Badge", badgesSchema);