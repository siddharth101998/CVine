const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bottles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bottle" }]
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);