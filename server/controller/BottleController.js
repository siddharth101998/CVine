const Bottle = require("../models/Bottles"); // Import Bottle model
const { search } = require("../Routes/bottleRoutes");
const Fuse = require("fuse.js");
const BottleView = require("../models/BottleViews");
// @desc    Get all bottles
// @route   GET /api/bottles
// @access  Public
const getAllBottles = async (req, res) => {
    try {
        console.log("fetch started")
        const bottles = await Bottle.find().limit(50);
        res.status(200).json({ success: true, data: bottles });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// @desc    Add a new bottle
// @route   POST /api/bottles
// @access  Admin
const addBottle = async (req, res) => {
    try {
        const newBottle = new Bottle(req.body);
        const savedBottle = await newBottle.save();
        res.status(201).json({ success: true, data: savedBottle });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid data", error });
    }
};

// @desc    Delete a bottle
// @route   DELETE /api/bottles/:id
// @access  Admin
const deleteBottle = async (req, res) => {
    try {
        const bottle = await Bottle.findById(req.params.id);
        if (!bottle) {
            return res.status(404).json({ success: false, message: "Bottle not found" });
        }
        await bottle.deleteOne();
        res.status(200).json({ success: true, message: "Bottle deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

const getBottleById = async (req, res) => {
    try {
        const bottle = await Bottle.findById(req.params.id);
        if (!bottle) {
            return res.status(404).json({ success: false, message: "Bottle not found" });
        }
        res.status(200).json({ success: true, data: bottle });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

const searchbottle = async (req, res) => {
    try {
        const query = req.query.q;
        let { country, wineType, grapeType } = req.query;

        console.log("search started", req.query);

        if (wineType) {
            wineType = Array.isArray(wineType) ? wineType : [wineType];
            wineType = wineType.map(decodeURIComponent);
        }

        let filter = {};
        if (country) filter.country = { $in: Array.isArray(country) ? country : [country] };
        if (wineType) filter.wineType = { $in: wineType };
        if (grapeType) filter.grapeType = { $in: Array.isArray(grapeType) ? grapeType : [grapeType] };

        if (query) {
            filter.name = { $regex: query, $options: 'i' }; // ✅ partial search
        }

        const bottles = await Bottle.find(filter, "name Winery country wineType grapeType imageUrl")
            .limit(query ? 20 : 5000)
            .lean();

        res.json({ success: true, data: bottles });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
const getTrending = async (req, res) => {
    try {
        console.log("absfd");
        // First, get top 10 bottleIds based on view counts
        const topBottles = await BottleView.find({})
            .sort({ viewCount: -1 })
            .limit(50)
            .select('bottleId viewCount')
            .lean();

        const bottleIds = topBottles.map(bv => bv.bottleId);
        console.log("bot", topBottles);
        // Now, fetch corresponding bottle details
        const bottles = await Bottle.find({ _id: { $in: bottleIds } }, 'name imageUrl');



        res.status(200).json({ success: true, data: bottles });
    } catch (error) {
        console.error("Error fetching top bottles overall:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
const getTopViewedBottles = async (req, res) => {
    try {
        const topBottles = await BottleView.find({})
            .sort({ viewCount: -1 })
            .limit(20)
            .select("bottleId viewCount");

        const bottleIds = topBottles.map(entry => entry.bottleId);
        const bottles = await Bottle.find({ _id: { $in: bottleIds } });

        // Create a map of view counts for reference
        const viewCountMap = topBottles.reduce((acc, curr) => {
            acc[curr.bottleId] = curr.viewCount;
            return acc;
        }, {});

        // Attach view count to bottle details
        const bottleDetailsWithViews = bottles.map(bottle => ({
            ...bottle.toObject(),
            viewCount: viewCountMap[bottle._id] || 0
        }));

        res.status(200).json({ success: true, data: bottleDetailsWithViews });
    } catch (error) {
        console.error("Error fetching top 20 viewed bottles:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = { getBottleById, deleteBottle, addBottle, getAllBottles, searchbottle, getTrending, getTopViewedBottles };