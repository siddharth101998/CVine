const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = '../data/firebased_Data.csv'; // Ensure the correct path

let wineList = [];
fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ',', quote: '"' })) // Ensure correct parsing
    .on('data', (row) => {
        console.log("Row:", row); // ✅ See raw row data
        wineList.push(row);
    })
    .on('end', () => {
        console.log("Extracted Wine Names:", wineList.map(wine => wine["Wine Name"] || wine["Wine Name "])); // ✅ Ensure correct column name
    })
    .on('error', (err) => {
        console.error("CSV Read Error:", err);
    });