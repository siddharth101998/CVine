const WineRegion = require('../models/WineRegion');

// Get all wine regions
const getWineRegions = async (req, res) => {
    try {
        const wineRegions = await WineRegion.find();
        res.status(200).json(wineRegions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wine regions", error });
    }
};

// Create a new wine region
const createWineRegion = async (req, res) => {
    try {
        console.log("craete country started", req.body)
        const { region, country } = req.body;
        if (!country) {
            return res.status(400).json({ message: "Region and country are required" });
        }
        const newWineRegion = new WineRegion({ region, country });
        await newWineRegion.save();
        res.status(201).json(newWineRegion);
    } catch (error) {
        res.status(500).json({ message: "Error creating wine region", error });
    }
};

module.exports = { getWineRegions, createWineRegion };