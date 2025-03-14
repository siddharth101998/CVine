const WineType = require('../models/Winetype');

// Get all wine types
const getWineTypes = async (req, res) => {
    try {
        console.log("fetch started winetype")
        const wineTypes = await WineType.find();
        res.status(200).json(wineTypes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wine types", error });
    }
};

// Create a new wine type
const createWineType = async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log("winetypecreate", req.body)
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const existingWineType = await WineType.find({ name: name });
        console.log("existing", existingWineType)
        if (existingWineType.length > 0) {
            return res.status(400).json({ message: "Wine Type  already exists" });
        }

        const newWineType = new WineType({ name, description });
        await newWineType.save();

        res.status(201).json(newWineType);
    } catch (error) {
        res.status(500).json({ message: "Error creating wine type", error });
    }
};

module.exports = { getWineTypes, createWineType };