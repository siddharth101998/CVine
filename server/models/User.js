const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: { type: String, },
    fullName: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['Normal', 'Admin'], required: true },
    wishlistid: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
    searchHistoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'SearchHistory' },
    loggedInCount: { type: Number, default: 0 },
    recipeCount: { type: Number, default: 0 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badges' }]
});

module.exports = mongoose.model('User', UserSchema);