const mongoose = require('mongoose');
const Bottle = require('./models/Bottles');
const WineType = require('./models/Winetype');
const WineRegion = require('./models/WineRegion');
const GrapeType = require('./models/Grapetype');

const MONGO_URI = "mongodb+srv://khandelwalsidhrth:Cvinefullstack25@cvine.c0znu.mongodb.net/"; // Replace with your MongoDB URI

const updateWineTypeAndRegion = async () => {
    try {
        console.log("Upload started");

        // Ensure database connection before executing queries
        if (mongoose.connection.readyState !== 1) {
            console.error("MongoDB connection not ready");
            return;
        }

        console.log("Fetching unique wine types and countries...");
        const uniqueWineTypes = await Bottle.distinct("wineType");
        const uniqueCountries = await Bottle.distinct("country");

        console.log(`Found ${uniqueWineTypes.length} unique wine types and ${uniqueCountries.length} unique countries.`);

        // Insert unique wine types into the WineType collection
        for (const name of uniqueWineTypes) {
            const existingType = await WineType.findOne({ name });
            if (!existingType) {
                const newWineType = new WineType({
                    name,
                    description: `Auto-added wine type: ${name}`
                });
                await newWineType.save();
            }
        }

        // Insert unique countries into the WineRegion collection (region will be empty)
        for (const country of uniqueCountries) {
            const existingRegion = await WineRegion.findOne({ country });
            if (!existingRegion) {
                const newWineRegion = new WineRegion({
                    country,
                    region: "" // Empty region as per request
                });
                await newWineRegion.save();
            }
        }

        console.log("Wine types and regions updated successfully!");
    } catch (error) {
        console.error("Error updating wine types and regions:", error);
    } finally {
        mongoose.disconnect(); // Close the connection after the operation
    }
};


const updateGrapeTypes = async () => {
    try {
        console.log("Fetching unique grape types...");

        // Step 1: Get unique grape types from Bottle collection
        let uniqueGrapeTypes = await Bottle.distinct("grapeType");

        // Step 2: Filter out grape types with special characters (only letters & spaces allowed)
        uniqueGrapeTypes = uniqueGrapeTypes.filter(grape => /^[A-Za-z\s]+$/.test(grape));

        console.log(`Valid grape types found: ${uniqueGrapeTypes.length}`);

        for (const grapeName of uniqueGrapeTypes) {
            // Step 3: Check if the grape type already exists
            const existingGrapeType = await GrapeType.findOne({ name: grapeName });
            if (existingGrapeType) continue;

            // Step 4: Find the matching wine type to get the type ID
            const matchingWineType = await WineType.findOne({ name: grapeName });

            const typeid = matchingWineType ? matchingWineType._id.toString() : null;

            // Step 5: Insert into GrapeType collection
            const newGrapeType = new GrapeType({
                typeid: typeid || "UNKNOWN",
                name: grapeName,
                description: `Auto-added grape type: ${grapeName}`
            });

            await newGrapeType.save();
            console.log(`Added Grape Type: ${grapeName}`);
        }

        console.log("Grape types updated successfully!");
    } catch (error) {
        console.error("Error updating grape types:", error);
    }
};

// Connect to MongoDB and then execute the function
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
    socketTimeoutMS: 45000 // Prevent socket timeouts
})
    .then(() => {
        console.log("MongoDB connected successfully");
        //updateWineTypeAndRegion();
        updateGrapeTypes();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });