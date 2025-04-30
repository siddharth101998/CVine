// updateBottles.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Bottle = require('./models/Bottles');

// 1. Connect to MongoDB
const MONGODB_URI = "mongodb+srv://khandelwalsidhrth:Cvinefullstack25@cvine.c0znu.mongodb.net/";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Path to the new CSV file
const csvFilePath = path.join(__dirname, '..', 'data', 'UpdateData.csv');

// 3. Prepare an array to accumulate bulk update operations.
let bulkOperations = [];

// 4. Create a read stream for the CSV file and parse it.
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        try {
            const imageUrl = row['Firebase Image URL']?.trim();

            if (!imageUrl) return;

            const setData = {};

            setData.fullDescription = row['new_wine_description'].trim();


            if (Object.keys(setData).length > 0) {
                bulkOperations.push({
                    updateOne: {
                        filter: { imageUrl },
                        update: { $set: setData },
                    },
                });
            }
        } catch (err) {
            console.error('Error processing row:', row, err);
        }
    })
    .on('end', async () => {
        console.log(`CSV file processing complete. Total records to update: ${bulkOperations.length}`);
        try {
            if (bulkOperations.length > 0) {
                const bulkWriteResult = await Bottle.bulkWrite(bulkOperations);
                console.log("Bulk update completed successfully. Result:");
                console.log(bulkWriteResult);
            } else {
                console.log("No valid records found to update.");
            }
        } catch (err) {
            console.error("Error during bulk update:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .on('error', (error) => {
        console.error("Error reading CSV file:", error);
    });