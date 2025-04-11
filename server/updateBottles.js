// updateBottles.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Bottle = require('./models/Bottles');

// 1. Connect to MongoDB
const MONGODB_URI = "mongodb+srv://khandelwalsidhrth:Cvinefullstack25@cvine.c0znu.mongodb.net/";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 2. Path to the new CSV file
const csvFilePath = path.join(__dirname, '..', 'data', 'updatedBottles.csv');

// 3. Prepare an array to accumulate bulk update operations.
let bulkOperations = [];

// 4. Create a read stream for the CSV file and parse it.
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Use 'Firebase Image URL' from the CSV as the mapping key to find the document.
        const filter = { imageUrl: row['Firebase Image URL'] };

        // Build the update operation. Adjust the fields below as necessary.
        // Here, we update various fields in the document based on CSV data.
        const update = {
            $set: {
                name: row['Wine Name'],
                Winery: row['Winery'], // Adjust if your schema uses a different name (e.g., brandWinery).
                foodPairings: row['Food Pairings'],
                grapeType: row['primary type'],
            }
        };

        // Push the updateOne operation to the bulkOperations array.
        bulkOperations.push({
            updateOne: {
                filter: filter,
                update: update,
            },
        });
    })
    .on('end', async () => {
        console.log(`CSV file processing complete. Total records to update: ${bulkOperations.length}`);
        try {
            if (bulkOperations.length > 0) {
                // 5. Execute all update operations as a bulkWrite.
                const bulkWriteResult = await Bottle.bulkWrite(bulkOperations);
                console.log("Bulk update completed successfully. Result:");
                console.log(bulkWriteResult);
            } else {
                console.log("No records found to update.");
            }
        } catch (err) {
            console.error("Error during bulk update:", err);
        } finally {
            // 6. Close the MongoDB connection.
            mongoose.connection.close();
        }
    })
    .on('error', (error) => {
        console.error("Error reading CSV file:", error);
    });