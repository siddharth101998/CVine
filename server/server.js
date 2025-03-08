require('dotenv').config();
const axios = require('axios');
axios.defaults.decompress = false;
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"], allowedHeaders: ["Content-Type", "Authorization"] }));
connectDB();

async function callOpenAI(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                        "Accept-Encoding": "identity",
                        "User-Agent": "OpenAI-Node"
                    }
                }
            );
            return response.data.choices[0].message.content; // ✅ Return AI-generated response
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`Rate limit hit. Retrying in ${2 ** i} seconds...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** i)); // Exponential backoff
            } else {
                console.error("OpenAI API error:", error);
                return "Error processing request.";
            }
        }
    }
    return "Error: Too many requests. Try again later.";
}
app.get('/', (req, res) => res.send('API Running...'));

// Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required." });

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept-Encoding": "identity",
                    "User-Agent": "OpenAI-Node"
                }
            }
        );

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            res.json({ reply: response.data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Unexpected API response format." });
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Error processing AI request." });
    }
});

// Wine Recommendation Route
app.post('/api/recommend', async (req, res) => {
    try {
        const { bottleName } = req.body;
        if (!bottleName) {
            return res.status(400).json({ error: "Bottle name is required." });
        }

        let wineList = [];
        const csvFilePath = '../data/firebased_Data.csv';

        fs.createReadStream(csvFilePath)
            .pipe(csv({ separator: ',', quote: '"' }))
            .on('data', (row) => {
                wineList.push(row);
            })
            .on('end', async () => {
                const wineNames = wineList.map(wine => wine["Wine Name"]).filter(Boolean).join(", ");
                const prompt = `Given the wine list: ${wineNames}, recommend the most similar wine to "${bottleName}".`;

                console.log("Sending Prompt to OpenAI:", prompt);

                const aiResponse = await callOpenAI(prompt); // ✅ Use retry mechanism
                res.json({ recommendation: aiResponse });
            })
            .on('error', (err) => {
                console.error("CSV Parsing Error:", err);
                res.status(500).json({ error: "CSV file error." });
            });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));