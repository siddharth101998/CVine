// importBottles.js
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

const csvFilePath = path.join(__dirname, '..', 'data', 'firebased_Data.csv');

let recordsInserted = 0;
let rowCount = 0;

// We store the stream reference so we can call `destroy()` after 5 entries.
const csvStream = fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
        if (rowCount < 5) {
            try {
                const newBottle = new Bottle({
                    name: row['Wine Name'],
                    wineType: row['Wine Type'],
                    Winery: row['Winery'], // <-- If your schema actually has `brandWinery`, rename accordingly
                    price: row['Price'],
                    avgRating: parseFloat(row['Rating']),
                    imageUrl: row['Firebase Image URL'],
                    fullDescription: row['Wine Description 1'],
                    region: row['Region'],
                    foodPairings: row['Food Pairings'],
                    grapeType: row['Grape Type'],
                    country: row['Country'],
                    alcoholContent: row['Alcohol Content'],
                    boldness: {
                        light: row['Light'] ? parseFloat(row['Light']) : 0,
                        smooth: row['Smooth'] ? parseFloat(row['Smooth']) : 0,
                        dry: row['Dry'] ? parseFloat(row['Dry']) : 0,
                        soft: row['Soft'] ? parseFloat(row['Soft']) : 0,
                        // Include any other columns if needed
                    },
                });

                await newBottle.save();
                recordsInserted++;
                rowCount++;
            } catch (err) {
                console.error('Error saving record:', err);
            }
        } else {
            // We've reached 5 entries; stop reading further data
            csvStream.destroy();
        }
    })
    .on('end', () => {
        console.log(`CSV file successfully processed. Records inserted: ${recordsInserted}`);
        mongoose.connection.close();
    })
    .on('error', (error) => {
        console.error('Error reading CSV file:', error);
    });