const Wishlist = require('../models/Wishlist');

// Add a bottle to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, bottleId } = req.body;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, bottleIds: [bottleId] });
        } else if (!wishlist.bottleIds.includes(bottleId)) {
            wishlist.bottleIds.push(bottleId);
        }

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error });
    }
};

// Remove a bottle from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, bottleId } = req.body;

        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { bottleIds: bottleId } },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error });
    }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.findOne({ userId }).populate('bottleIds');

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
};
