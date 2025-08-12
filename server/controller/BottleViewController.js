const BottleView = require("../models/BottleViews");
const Bottle = require("../models/Bottles");

const updateBottleView = async (req, res) => {
    try {
        const { bottleId, userId, bottlename } = req.body;

        if (!bottleId || !userId || !bottlename) {
            return res.status(400).json({ success: false, message: "Bottle ID and User ID are required." });
        }

        // Use `findOneAndUpdate` to update if exists, otherwise create a new entry
        let bottleView = await BottleView.findOneAndUpdate(
            { bottleId, userId, bottlename: bottlename },
            { $inc: { viewCount: 1 } }, // Increment view count
            { new: true, upsert: true } // Create if not exists
        );

        console.log("Bottle view updated:", bottleView);

        // Increment view count in the Bottle collection
        await Bottle.findByIdAndUpdate(bottleId, { $inc: { viewCount: 1 } });

        res.status(200).json({ success: true, message: "Bottle view updated.", data: bottleView });
    } catch (error) {
        console.error("Error updating bottle view:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getUserSearchHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const searchHistory = await BottleView.find({ userId })
            .sort({ updatedAt: -1 }) // Sort by most recent views
            .select("bottleId viewCount createdAt updatedAt"); // Select relevant fields

        res.status(200).json({ success: true, data: searchHistory });
    } catch (error) {
        console.error("Error fetching user search history:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getTopBottlesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const topBottles = await BottleView.find({ userId })
            .sort({ viewCount: -1 })
            .limit(10)
            .select("bottleId viewCount");

        res.status(200).json({ success: true, data: topBottles });
    } catch (error) {
        console.error("Error fetching top bottles for user:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    updateBottleView,
    getTopBottlesForUser,
    getUserSearchHistory
};
