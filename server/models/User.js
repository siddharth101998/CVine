const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['Normal', 'Admin'], required: true },
    likedBeverages: [{ type: String }], // Array of beverage types
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bottle' }],
    searchHistory: [{ type: String }],
    viewedHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bottle' }],
    loggedInCount: { type: Number, default: 0 },
    pageCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);