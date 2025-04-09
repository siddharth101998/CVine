require("dotenv").config();
const vision = require("@google-cloud/vision");

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./config/dotted-tide-453000-f3-2c7e9aae9a03.json";

const client = new vision.ImageAnnotatorClient();
const axios = require("axios");
axios.defaults.decompress = false;
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const fs = require("fs");
const csv = require("csv-parser");
const Bottle = require("./models/Bottles");
const Tesseract = require("tesseract.js");
//const { chat, recommend } = require("./controller/gptController")
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB();

//API's for ChatGPT

async function callOpenAI(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
            "Accept-Encoding": "identity",
            "User-Agent": "OpenAI-Node",
          },
        }
      );
      return response.data.choices[0].message.content; // ✅ Return AI-generated response
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn(`Rate limit hit. Retrying in ${2 ** i} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i)); // Exponential backoff
      } else {
        console.error("OpenAI API error:", error);
        return "Error processing request.";
      }
    }
  }
  return "Error: Too many requests. Try again later.";
}
// Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message is required." });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "Accept-Encoding": "identity",
          "User-Agent": "OpenAI-Node",
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
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
app.post("/api/recommend", async (req, res) => {
  try {
    const { bottleName } = req.body;
    if (!bottleName) {
      return res.status(400).json({ error: "Bottle name is required." });
    }

    // Stage 1: Get the wine attributes for the given bottle name.
    const attributePrompt = `
You are an expert sommelier.
Given the wine name "${bottleName}", please provide the most likely wine attributes in the following JSON format:
{
  "wineType": "<wine type>",
  "region": "<region>",
  "grapeType": "<grape type>"
}
Where wine types are "Red wine", "White wine", "Desert wine", "Sparkling wine", "Rose wine".
For region, for example, it should be just "Napa Valley" and not "Napa Valley, California".
Ensure that your output is a valid JSON object with only these keys and nothing else.
`;

    const attributeResponse = await callOpenAI(attributePrompt);
    console.log("atrRES", attributeResponse);

    // Remove potential markdown formatting (e.g. triple backticks)
    const cleanedResponse = attributeResponse
      .replace(/```(json)?/gi, '')  // remove starting markdown fences (e.g. ```json)
      .replace(/```/g, '')          // remove ending markdown fences (```)
      .trim();
    let attributes = {};
    try {
      attributes = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing wine attributes:", parseError);
      return res.status(500).json({ error: "Error parsing wine attributes." });
    }
    console.log("atr", attributes);
    // Stage 2: Use the returned attributes to filter your bottle collection.
    // Prepare regular expressions for filtering (if attribute is missing, match everything using /.*/)
    const wineTypeRegex = attributes.wineType ? new RegExp(attributes.wineType, "i") : /.*/;
    const regionRegex = attributes.region ? new RegExp(attributes.region, "i") : /.*/;
    const grapeTypeRegex = attributes.grapeType ? new RegExp(attributes.grapeType, "i") : /.*/;

    // Query your database with the filters on wineType, region, and grapeType.
    const filteredBottles = await Bottle.find({
      wineType: { $regex: wineTypeRegex },
      region: { $regex: regionRegex },
      grapeType: { $regex: grapeTypeRegex }
    }, { name: 1 }).limit(50);
    console.log("filtered", filteredBottles.length)
    // Map the filtered bottles into an array of objects with id and name.
    const wineList = filteredBottles
      .filter(bottle => bottle.name)
      .map(bottle => ({
        id: bottle._id.toString(), // Ensure the id is a string
        name: bottle.name
      }));
    console.log("Bottles", wineList)
    // Convert the wine list array to a JSON string.
    const wineListJSON = JSON.stringify(wineList, null, 2);

    // Stage 3: Build a final prompt using the filtered list.
    const finalPrompt = `
You are an expert sommelier.
Given the following wine list in JSON format:
${wineListJSON}

Please recommend the wine most similar to "${bottleName}" based on flavor profile, region, and style.
Your response should be a valid JSON object with the following structure:
{
  "bottleId": "<ID of the recommended bottle>",
  "bottleName": "<Name of the recommended bottle>",
  "explanation": "<Brief explanation for the recommendation>"
}
and make sure "${bottleName}" ias not part of the recommended response
Ensure that your output is only this JSON object and nothing else.
    `;

    // Call OpenAI with the final prompt.
    const recommendation = await callOpenAI(finalPrompt);

    // Return the final recommendation.
    res.json({ recommendation });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/process-image", async (req, res) => {
  try {
    console.log("proces started");
    const { imageUrl } = req.body;
    console.log(imageUrl);
    if (!imageUrl)
      return res.status(400).json({ message: "❌ Image URL is required" });

    // Perform OCR using Google Cloud Vision
    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;
    const text = detections.length ? detections[0].description : "";

    console.log("✅ Extracted Text:", text);
    const keywords = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);
    console.log("🔎 Keywords extracted:", keywords);

    const regexKeywords = keywords.map((word) => new RegExp(word, "i")); // Case-insensitive regex patterns

    // Step 1: Search by name (Highest Priority)
    let matchingWines = await Bottle.find({
      name: { $regex: regexKeywords.join("|"), $options: "i" },
    }).limit(10);

    // Step 2: If no direct name match, search in Winery
    if (matchingWines.length === 0) {
      matchingWines = await Bottle.find({
        Winery: { $regex: regexKeywords.join("|"), $options: "i" },
      }).limit(10);
    }

    // Step 3: If no match in name or winery, expand to other fields
    if (matchingWines.length === 0) {
      matchingWines = await Bottle.find({
        $or: [
          { region: { $regex: regexKeywords.join("|"), $options: "i" } },
          { grapeType: { $regex: regexKeywords.join("|"), $options: "i" } },
          { country: { $regex: regexKeywords.join("|"), $options: "i" } },
          {
            fullDescription: { $regex: regexKeywords.join("|"), $options: "i" },
          },
        ],
      }).limit(10);
    }

    // Step 4: Score Matches Dynamically Based on Keyword Presence
    matchingWines = matchingWines.map((wine) => {
      let score = 0;
      const wineData = [
        { field: "name", value: wine.name, weight: 10 },
        { field: "Winery", value: wine.Winery, weight: 7 },
        { field: "region", value: wine.region, weight: 5 },
        { field: "grapeType", value: wine.grapeType, weight: 4 },
        { field: "country", value: wine.country, weight: 3 },
        { field: "fullDescription", value: wine.fullDescription, weight: 2 },
      ];

      wineData.forEach(({ value, weight }) => {
        if (value) {
          const matchCount = keywords.filter((k) =>
            value.toLowerCase().includes(k)
          ).length;
          score += matchCount * weight;
        }
      });

      return { ...wine._doc, score };
    });

    // Step 5: Sort by Score & Highest Rating
    matchingWines.sort(
      (a, b) => b.score - a.score || b.avgRating - a.avgRating
    );

    console.log("🟢 Final Sorted Matches:", matchingWines);
    if (!matchingWines.length) {
      return res
        .status(200)
        .json({ message: "No matching wine found", keywords });
    }

    res.json(matchingWines[0]); // Return the best match/ Return the best match
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

//API'ss for DataBase
const userRoutes = require("./Routes/UserRoutes");
app.use("/user", userRoutes);

const bottleRoutes = require("./Routes/bottleRoutes");
app.use("/bottle", bottleRoutes);

const regionRoutes = require("./Routes/regionRoutes");
app.use("/region", regionRoutes);

const winetypeRoutes = require("./Routes/winetypeRoutes");
app.use("/winetype", winetypeRoutes);

const grapetypeRoutes = require("./Routes/grapetypeRoutes");
app.use("/grapetype", grapetypeRoutes);

const bottleviewRoutes = require("./Routes/bottleviewRoutes");
app.use("/bottleview", bottleviewRoutes);

const reviewRoutes = require("./Routes/reviewRoutes");
app.use("/review", reviewRoutes);

const recipeRoutes = require("./Routes/recipeRoutes");
app.use("/recipe", recipeRoutes);

const wishlistRoutes = require("./Routes/wishlistRoutes");
app.use("/wishlist", wishlistRoutes);

const searchHistoryRoutes = require("./Routes/searchHistoryRoutes");
app.use("/searchHistory", searchHistoryRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
