const Wishlist = require('../models/Wishlist');

// // Add a bottle to wishlist
// const addToWishlist = async (req, res) => {
//     try {
//         const { userId, bottleId } = req.body;

//         let wishlist = await Wishlist.findOne({ userId });

//         if (!wishlist) {
//             wishlist = new Wishlist({ userId, bottles: [bottleId] });
//         } else if (!wishlist.bottles.includes(bottleId)) {
//             wishlist.bottles.push(bottleId);
//         }

//         await wishlist.save();
//         res.status(200).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding to wishlist', error });
//     }
// };

// // Remove a bottle from wishlist
// const removeFromWishlist = async (req, res) => {
//     try {
//         const { userId, bottleId } = req.body;

//         const wishlist = await Wishlist.findOneAndUpdate(
//             { userId },
//             { $pull: { bottleIds: bottleId } },
//             { new: true }
//         );

//         if (!wishlist) {
//             return res.status(404).json({ message: 'Wishlist not found' });
//         }

//         res.status(200).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: 'Error removing from wishlist', error });
//     }
// };


const toggleWishlist = async (req, res) => {
    try {
        const { userId, bottleId } = req.body;

        // Find the wishlist for the given user
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            // If no wishlist exists, create a new one with the bottle added
            wishlist = new Wishlist({ userId, bottles: [bottleId] });
        } else {
            // If the wishlist exists, check if the bottle is already present
            if (wishlist.bottles.includes(bottleId)) {
                // If the bottle is in the wishlist, remove it (toggle off)
                wishlist.bottles = wishlist.bottles.filter(id => id.toString() !== bottleId);
            } else {
                // If the bottle is not in the wishlist, add it (toggle on)
                wishlist.bottles.push(bottleId);
            }
        }

        // Save the updated wishlist
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling wishlist', error });
    }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlist = await Wishlist.findOne({ userId: id }).populate('bottles');
        console.log("wish", wishlist)
        if (!wishlist) {
            // Instead of returning 404, return an empty wishlist object
            return res.status(200).json({ userId: id, bottles: [] });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error });
    }
};

module.exports = {

    getWishlist, toggleWishlist
};
