const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/WishlistController');

router.post('/wishlist/add', wishlistController.addToWishlist); // Add to wishlist
router.post('/wishlist/remove', wishlistController.removeFromWishlist); // Remove from wishlist
router.get('/wishlist/:userId', wishlistController.getWishlist); // Get user's wishlist

module.exports = router;
