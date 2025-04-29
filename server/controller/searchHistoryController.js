const SearchHistory = require('../models/SearchHistory');

const addhistory = async (req, res) => {
    try {
        // Destructure the request body for userId and bottles
        const { userId, bottle } = req.body;
        console.log("histroy body", req.body);
        // Create a new entry. The createdat field will automatically use the default.
        const newEntry = new SearchHistory({ userId, bottle });

        // Save the entry in the database
        await newEntry.save();

        // Return the saved entry as a JSON response
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error adding search history entry:', error);
        res.status(500).json({ error: 'Server error while adding entry' });
    }
};

const gethistory = async (req, res) => {
    try {
        console.log("searchhistory fetching")
        const { id } = req.params;

        // Find entries matching the given userId. Optionally, populate related fields.
        const entries = await SearchHistory.find({ userId: id })
            .populate('bottle')  // If you want to include bottle details
            .populate('userId');  // If you want to include user details

        res.status(200).json(entries);
    } catch (error) {
        console.error('Error retrieving search history entries:', error);
        res.status(500).json({ error: 'Server error while retrieving entries' });
    }
};
module.exports = { gethistory, addhistory }