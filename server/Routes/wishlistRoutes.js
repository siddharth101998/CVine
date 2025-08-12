const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/WishlistController');

router.get('/:id', wishlistController.getWishlist); // Get user's wishlist
router.post('/toggle', wishlistController.toggleWishlist); // Add to wishlist



module.exports = router;
