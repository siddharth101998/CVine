const GrapeType = require('../models/Grapetype');

const getGrapeTypes = async (req, res) => {
    try {
        console.log("fetch grape started");
        const grapeTypes = await GrapeType.find();
        res.status(200).json(grapeTypes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grape types", error });
    }
};

module.exports = { getGrapeTypes };
