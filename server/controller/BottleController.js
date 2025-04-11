const Bottle = require("../models/Bottles"); // Import Bottle model
const { search } = require("../Routes/bottleRoutes");
const Fuse = require("fuse.js");

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
        const query = req.query.q; // Search term
        const { country, wineType, grapeType } = req.query; // Extract filters from query params

        if (!query) return res.json({ success: true, data: [] });

        // Create a filter object for MongoDB query
        let filter = {};

        if (country) filter.country = country;
        if (wineType) filter.wineType = wineType;
        if (grapeType) filter.grapeType = grapeType;

        // Fetch relevant bottles from DB with filters (limit to 50 for performance)
        const bottles = await Bottle.find(filter, "name winery country winetype grapetype").limit(50);

        // Use Fuse.js for fuzzy search
        const fuse = new Fuse(bottles, {
            keys: ["name"],
            threshold: 0.3,
        });

        // Get top 10 matches
        const results = fuse.search(query).slice(0, 10).map(r => r.item);

        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { getBottleById, deleteBottle, addBottle, getAllBottles, searchbottle }