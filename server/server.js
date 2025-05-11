require("dotenv").config();
const vision = require("@google-cloud/vision");
const fs = require("fs");

let credentials;

if (process.env.GOOGLE_VISION_KEY_BASE64) {
  const decoded = Buffer.from(process.env.GOOGLE_VISION_KEY_BASE64, "base64").toString("utf-8");
  credentials = JSON.parse(decoded);
}

const client = new vision.ImageAnnotatorClient({
  credentials: credentials
});
const axios = require("axios");
axios.defaults.decompress = false;
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

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
    const { messages } = req.body;  // 👈 Now expecting array of full conversation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Prepend system message for every conversation
    const systemMessage = {
      role: "system",
      content:
        "You are a wine and wine recipe expert. Keep your answers concise and under 50 words. If the question is not related to wines or their recipes, respond: 'I do not know about this. Can I help you with wine knowledge?'"
    };
    const openAIMessages = [systemMessage, ...messages];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: openAIMessages,
        // messages: messages
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

    if (response.data?.choices?.length > 0) {
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
// app.post("/api/recommend", async (req, res) => {
//   try {
//     // Expect an array of bottle names from the client's request body.
//     // For example: { selectedBottles: ["Wine A", "Wine B", ...] }
//     const { selectedBottles } = req.body;
//     if (!selectedBottles || !Array.isArray(selectedBottles) || selectedBottles.length === 0) {
//       return res.status(400).json({ error: "At least one bottle name is required." });
//     }

//     // Limit to a maximum of 20 bottles.
//     const inputBottleNames = selectedBottles.slice(0, 20);

//     // ======= Stage 1: Get Wine Attributes for Each Input Bottle =======
//     // Instead of aggregating into one taste category, ask for a per-bottle breakdown.
//     const attributePrompt = `
// You are an expert sommelier.
// Given the following list of wine bottle names:
// ${JSON.stringify(inputBottleNames, null, 2)}
// You will receive a list of wine names. For each name, identify the most likely:

// - wineType: one of “Red wine”, “White wine”, “Dessert wine”, “Sparkling wine”, “Rosé wine”
// - region: just the appellation (e.g. “Napa Valley”)
// - grapeType: the primary grape variety (e.g. “Cabernet Sauvignon”)

// Output a single JSON object with exactly one key, "preferences", whose value is an array of objects, each matching this schema:

// {
//   "wineType": "<wine type>",
//   "region": "<region>",
//   "grapeType": "<grape type>"
// }

// Deduplicate entries: if two or more wines resolve to identical triplets, include that combination only once.

// **Do not** output anything besides this JSON. No explanations, no extra keys.  `;

//     const attributeResponse = await callOpenAI(attributePrompt);
//     console.log("Attribute Response:", attributeResponse);

//     // Remove potential markdown formatting (e.g., triple backticks)
//     const cleanedAttrResponse = attributeResponse
//       .replace(/```(json)?/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     let attributesResult = {};
//     try {
//       attributesResult = JSON.parse(cleanedAttrResponse);
//     } catch (parseError) {
//       console.error("Error parsing wine attributes:", parseError);
//       return res.status(500).json({ error: "Error parsing wine attributes." });
//     }

//     // Expecting an object with key "preferences" which is an array.
//     if (
//       !attributesResult.preferences ||
//       !Array.isArray(attributesResult.preferences) ||
//       attributesResult.preferences.length === 0
//     ) {
//       return res.status(500).json({ error: "No wine attributes returned." });
//     }

//     const preferences = attributesResult.preferences;
//     console.log("Parsed Preferences:", preferences);

//     // ======= Stage 2: Query the Database for Candidate Bottles =======
//     // Aim to select a total of 50 candidate bottles, distributed equally across the provided preferences.
//     const numPreferences = preferences.length;
//     const bottlesPerPreference = Math.floor(50 / numPreferences);
//     let candidateBottles = [];

//     for (const pref of preferences) {
//       const wineTypeRegex = pref.wineType ? new RegExp(pref.wineType, "i") : /.*/;
//       const regionRegex = pref.region ? new RegExp(pref.region, "i") : /.*/;
//       const grapeTypeRegex = pref.grapeType ? new RegExp(pref.grapeType, "i") : /.*/;

//       // Query your Bottle collection filtering by wineType, region, and grapeType.
//       const bottlesForPref = await Bottle.find(
//         {
//           wineType: { $regex: wineTypeRegex },
//           region: { $regex: regionRegex },
//           grapeType: { $regex: grapeTypeRegex }
//         },
//         { name: 1, imageUrl: 1 }    // ← also fetch imageUrl
//       ).limit(bottlesPerPreference);

//       const formattedBottles = bottlesForPref
//         .filter(bottle => bottle.name)
//         .map(bottle => ({
//           id: bottle._id.toString(),
//           name: bottle.name,
//           imageUrl: bottle.imageUrl
//         }));

//       candidateBottles = candidateBottles.concat(formattedBottles);
//     }

//     // If fewer than 50 candidates were collected, fill in with additional bottles from the entire collection.
//     if (candidateBottles.length < 50) {
//       const additionalCount = 50 - candidateBottles.length;
//       const extraBottles = await Bottle.find({}, { name: 1, imageUrl: 1 }).limit(additionalCount);
//       candidateBottles = candidateBottles.concat(
//         extraBottles.map(bottle => ({
//           id: bottle._id.toString(),
//           name: bottle.name,
//           imageUrl: bottle.imageUrl
//         }))
//       );
//     }
//     console.log("Total Candidate Bottles:", candidateBottles.length);

//     const candidateJSON = JSON.stringify(candidateBottles, null, 2);

//     // ======= Stage 3: Final Recommendation Prompt =======
//     const finalPrompt = `
// You are an expert sommelier.
// Based on the extracted attributes for the input wines, consider the following candidate wines:
// ${candidateJSON}

// Please recommend 10 bottles from this candidate list that best represent a balanced selection across the different taste preferences.
//  Return your answer as a valid JSON array of objects, each with:
//  {
//    "bottleId":   "<ID of the recommended bottle>",
//    "bottleName": "<Name of the recommended bottle>",
//    "explanation":"<Brief explanation for why it matches the user’s tastes>"
//  }and for explanation - explain why they are similar to bottles in the  ${JSON.stringify(inputBottleNames, null, 2)} and respond in a way user understand why this was recomended
// Also ensure that none of the input wine names are recommended.
// Ensure that your output is only this JSON array and nothing else.
//     `;

//     const finalRecommendation = await callOpenAI(finalPrompt);
//     const cleanedFinalRecommendation = finalRecommendation
//       .replace(/```(json)?/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     let recommendations;
//     try {
//       recommendations = JSON.parse(cleanedFinalRecommendation);


//     } catch (error) {
//       console.error("Error parsing final recommendations:", error);
//       return res.status(500).json({ error: "Error parsing final recommendations." });
//     }
//     const enriched = recommendations.map(rec => {
//       const match = candidateBottles.find(b => b.id === rec.bottleId);
//       return {
//         bottleId: rec.bottleId,
//         bottleName: rec.bottleName,
//         imageUrl: match ? match.imageUrl : null,
//         explanation: rec.explanation
//       };
//     });
//     console.log("recommendations", enriched)
//     // Return the final recommendations.
//     res.json({ recommendations: enriched });

//   } catch (error) {
//     console.error("Server Error:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });
app.post("/process-image", async (req, res) => {
  try {
    console.log("Process started");
    const { imageUrl } = req.body;
    console.log(imageUrl);
    if (!imageUrl)
      return res.status(400).json({ message: "❌ Image URL is required" });

    // Perform OCR using Google Cloud Vision
    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;
    const text = detections.length ? detections[0].description : "";
    console.log("✅ Extracted Text:", text);
    if (!text.trim()) {
      console.log("❌ No text detected from image.");
      return res.status(200).json([]); // or res.json([]) is fine too
    }

    // const keywords = text
    //   .toLowerCase()
    //   .replace(/[^a-z0-9\s]/g, "")
    //   .split(/\s+/)
    //   .filter((word) => word.length > 3);
    // console.log("🔎 Keywords extracted:", keywords);

    // ---------- Step 1: Extract Wine Attributes Using GPT ----------

    // Build a prompt to extract structured attributes from the keywords.
    // We ask GPT, acting as an expert sommelier, to return only relevant attributes.
    const attributePrompt = `
You are an expert sommelier and global wine researcher.

Below is OCR-extracted text from a wine label:

${text}

Your job is to identify the **correct wine** these keywords most likely refer to and return its key attributes as a valid **JSON object**.

You must:
- Interpret fragmented, partial, or unordered text.
- Reconstruct the **correct wine name**, even if it appears in parts (e.g., "É TAIN", "ERM", "EX VOTO").
- Use your complete knowledge of global wines to **identify the winery**, even if it is not explicitly mentioned in the text. (e.g., recognize that "M. Etain" is produced by "Scarecrow", or that "Clio" is from "Bodegas El Nido").
- Infer the most likely **grape variety** based on known associations (e.g., region, wine name, or winery).

Output **only** a valid JSON object with exactly the following structure. No commentary, no explanation, no extra keys.

The JSON object must contain **exactly** these keys:
- "winery": string | null — The full name of the winery (pure text only; remove any accented or special characters like “ô”)
- "name": string | null — The full name of the wine (reconstructed if fragmented)
- "grapeType": string | null — The primary grape variety (e.g., "Cabernet Sauvignon", "Monastrell", etc.)

Strict output rules:
	•	Remove any special characters (e.g., “ô”, accents) in winery and name.
	•	Use null only if a value cannot be confidently identified.
	•	Output must be strictly valid JSON and contain no other content.`;

    // Use your GPT request function (similar to your /api/chat route) to get the attributes.
    // You can reuse your callOpenAI function if it's in scope.
    const rawattributeResponse = await callOpenAI(attributePrompt);
    //console.log("GPT Attribute Response:", rawattributeResponse);
    let attributeResponse = rawattributeResponse
      .replace(/```(json)?/g, "")
      .replace(/```/g, "")
      .trim();
    console.log("GPT Attribute Response:", attributeResponse);
    // Parse the response (ensure it returns valid JSON)
    let wineAttributes = {};
    try {
      wineAttributes = JSON.parse(attributeResponse);
    } catch (parseError) {
      console.error("Error parsing wine attributes from GPT:", parseError);
      // In case of an error, you can fallback to a default empty object or simple regex search.
      wineAttributes = {};
    }
    if (!wineAttributes || !wineAttributes.winery || !wineAttributes.name || !wineAttributes.grapeType) {
      console.log("❌ Incomplete wine attributes from GPT.");
      return res.status(200).json([]); // return an empty list
    }
    console.log("Extracted Wine Attributes:", wineAttributes);

    if (!wineAttributes || !wineAttributes.winery) {
      console.log("No valid winery extracted. Falling back to fuzzy search.");
      wineAttributes = { winery: fuzzyRegex };
    }

    // --------- Step 1: Query by Winery only ---------
    let normalizedWinery = wineAttributes.winery.replace(/\s+/g, '').toLowerCase();


    // let matchingWines = await Bottle.find({
    //   $expr: {
    //     $regexMatch: {
    //       input: { $replaceAll: { input: "$Winery", find: " ", replacement: "" } },
    //       regex: normalizedWinery,
    //       options: "i"
    //     }
    //   }
    // });
    const matchingWines = await Bottle.find({
      $or: [
        // 1) match normalized‐Winery against Winery (spaces stripped)
        {
          $expr: {
            $regexMatch: {
              input: {
                $replaceAll: {
                  input: "$Winery",
                  find: " ",
                  replacement: ""
                }
              },
              regex: normalizedWinery,
              options: "i"
            }
          }
        },

        // 2) match name field against wineAttributes.name
        { name: { $regex: wineAttributes.name, $options: "i" } }
      ]
    });


    console.log("After Winery query, found:", matchingWines.length, "wine(s)");
    // if (matchingWines.length === 0 && wineAttributes.name) {
    //   // fallback: search by wine name
    //   const normalizedInputName = wineAttributes.name
    //     .replace(/\s+/g, "")
    //     .toLowerCase();

    //   matchingWines = await Bottle.find({
    //     name: { $regex: wineAttributes.name, $options: "i" }
    //   });
    //   console.log("Fallback Name query, found:", matchingWines.length, "wine(s)");
    // }

    if (matchingWines.length > 1 && wineAttributes.name) {
      const normalizedInputName = wineAttributes.name.replace(/\s+/g, "").toLowerCase();

      const nameMatches = matchingWines.filter((wine) => {
        if (!wine.name) return false;

        const normalizedWineName = wine.name.replace(/\s+/g, "").toLowerCase();
        return normalizedWineName.includes(normalizedInputName);
      });

      if (nameMatches.length > 0) {
        matchingWines = nameMatches;
      }
    }
    console.log("After Name filtering, found:", matchingWines.length, "wine(s)");

    // --------- Step 3: If still multiple, refine by grapeType ---------
    if (matchingWines.length > 1 && wineAttributes.grapeType) {
      const normalizedInputGrape = wineAttributes.grapeType.replace(/\s+/g, "").toLowerCase();

      const grapeMatches = matchingWines.filter((wine) => {
        if (!wine.grapeType) return false;

        const normalizedWineGrape = wine.grapeType.replace(/\s+/g, "").toLowerCase();
        return normalizedWineGrape.includes(normalizedInputGrape);
      });

      if (grapeMatches.length > 0) {
        matchingWines = grapeMatches;
      }
    }
    console.log("After grapeType filtering, found:", matchingWines.length, "wine(s)");

    if (!matchingWines.length) {
      return res.status(200).json({ message: "No matching wine found", wineAttributes });
    }

    // Return the first (or best) match
    res.json(matchingWines);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});
// async function test() {
//   try {
//     const [result] = await client.textDetection({
//       image: { source: { imageUri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Wine_label_sample.jpg" } }
//     });
//     console.log("✅ Text:", result.textAnnotations?.[0]?.description || "No text found");
//   } catch (err) {
//     console.error("❌ Failed:", err.message);
//   }
// }

// app.post("/process-image", async (req, res) => {
//   try {
//     console.log("proces started");
//     const { imageUrl } = req.body;
//     console.log(imageUrl);
//     if (!imageUrl)
//       return res.status(400).json({ message: "❌ Image URL is required" });

//     // Perform OCR using Google Cloud Vision
//     const [result] = await client.textDetection(imageUrl);
//     const detections = result.textAnnotations;
//     const text = detections.length ? detections[0].description : "";

//     console.log("✅ Extracted Text:", text);
//     const keywords = text
//       .toLowerCase()
//       .replace(/[^a-z0-9\s]/g, "")
//       .split(/\s+/)
//       .filter((word) => word.length > 3);
//     console.log("🔎 Keywords extracted:", keywords);


//     // // Step 1: Search by name (Highest Priority)
//     // let matchingWines = await Bottle.find({
//     //   name: { $regex: regexKeywords.join("|"), $options: "i" },
//     // }).limit(10);

//     // // Step 2: If no direct name match, search in Winery
//     // if (matchingWines.length === 0) {
//     //   matchingWines = await Bottle.find({
//     //     Winery: { $regex: regexKeywords.join("|"), $options: "i" },
//     //   }).limit(10);
//     // }

//     // // Step 3: If no match in name or winery, expand to other fields
//     // if (matchingWines.length === 0) {
//     //   matchingWines = await Bottle.find({
//     //     $or: [
//     //       { region: { $regex: regexKeywords.join("|"), $options: "i" } },
//     //       { grapeType: { $regex: regexKeywords.join("|"), $options: "i" } },
//     //       { country: { $regex: regexKeywords.join("|"), $options: "i" } },
//     //       {
//     //         fullDescription: { $regex: regexKeywords.join("|"), $options: "i" },
//     //       },
//     //     ],
//     //   }).limit(10);
//     // }

//     // // Step 4: Score Matches Dynamically Based on Keyword Presence
//     // matchingWines = matchingWines.map((wine) => {
//     //   let score = 0;
//     //   const wineData = [
//     //     { field: "name", value: wine.name, weight: 10 },
//     //     { field: "Winery", value: wine.Winery, weight: 7 },
//     //     { field: "region", value: wine.region, weight: 5 },
//     //     { field: "grapeType", value: wine.grapeType, weight: 4 },
//     //     { field: "country", value: wine.country, weight: 3 },
//     //     { field: "fullDescription", value: wine.fullDescription, weight: 2 },
//     //   ];

//     //   wineData.forEach(({ value, weight }) => {
//     //     if (value) {
//     //       const matchCount = keywords.filter((k) =>
//     //         value.toLowerCase().includes(k)
//     //       ).length;
//     //       score += matchCount * weight;
//     //     }
//     //   });

//     //   return { ...wine._doc, score };
//     // });

//     // // Step 5: Sort by Score & Highest Rating
//     // matchingWines.sort(
//     //   (a, b) => b.score - a.score || b.avgRating - a.avgRating
//     // );

//     // console.log("🟢 Final Sorted Matches:", matchingWines);
//     // if (!matchingWines.length) {
//     //   return res
//     //     .status(200)
//     //     .json({ message: "No matching wine found", keywords });
//     // }

//     // res.json(matchingWines[0]); // Return the best match/ Return the best match

//     // ===== UPDATED MATCHING WINES LOGIC =====

//     // Step 1: Search by Winery using all keywords
//     // Remove duplicate keywords to build a more effective regex
//     // Remove duplicate keywords, just for good measure
//     const uniqueKeywords = [...new Set(keywords)];
//     const regexKeywords = uniqueKeywords.map((word) => new RegExp(word, "i"));

//     // Create fuzzy regex patterns that allow for optional whitespace between letters.
//     // For example, "eguigal" becomes "e\s*g\s*u\s*i\s*g\s*a\s*l".
//     const fuzzyKeywords = uniqueKeywords.map(word =>
//       word.split("").join("\\s*")
//     );

//     // Join the fuzzy keywords with a "|" to create a combined regex pattern.
//     const fuzzyRegex = fuzzyKeywords.join("|");

//     // Step 1: Search by Winery only using the fuzzy regex to allow for mismatched spacing
//     let matchingWines = await Bottle.find({
//       Winery: { $regex: fuzzyRegex, $options: "i" }
//     });

//     //  console.log("Step 1 (Winery) matches:", matchingWines); 

//     // Step 2: If more than one match, refine by Name
//     // Step 3: If there's still more than one match, refine by grapeType
//     if (matchingWines.length > 1) {
//       const nameMatches = matchingWines.filter((wine) =>
//         wine.name && new RegExp(fuzzyRegex, "i").test(wine.name)
//       );
//       if (nameMatches.length > 0) {
//         matchingWines = nameMatches;
//       }
//     }

//     console.log("Step 2 (Name) refined matches:", matchingWines.length);

//     // Step 3: If there's still more than one match, refine by grapeType
//     if (matchingWines.length > 1) {
//       const grapeMatches = matchingWines.filter((wine) =>
//         regexKeywords.some((regex) => wine.grapeType && regex.test(wine.grapeType))
//       );
//       if (grapeMatches.length > 0) {
//         matchingWines = grapeMatches;
//       }
//     }

//     console.log("Step 3 (grapeType) refined matches:", matchingWines.length);

//     if (!matchingWines.length) {
//       return res.status(200).json({ message: "No matching wine found", keywords });
//     }

//     res.json(matchingWines[0]); // Return the best match

//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).json({ message: "Error processing image" });
//   }
// });

//API'ss for DataBase

// Wine Recommendation Route
app.post("/api/recommend", async (req, res) => {
  try {
    const { selectedBottles } = req.body;
    if (!Array.isArray(selectedBottles) || selectedBottles.length === 0) {
      return res.status(400).json({ error: "At least one bottle name is required." });
    }
    const inputBottleNames = selectedBottles.slice(0, 20);

    // === Stage 1: Extract attributes via OpenAI ===
    const attributePrompt = `
You are an expert sommelier.
Given the following list of wine bottle names:
${JSON.stringify(inputBottleNames, null, 2)}
For each, output exactly:
{ "wineType": "...", "region": "...", "grapeType": "..." }
Deduplicate identical triplets.
Return only: { "preferences": [ ... ] }
    `;
    const rawAttr = (await callOpenAI(attributePrompt))
      .replace(/```(json)?/gi, "")
      .trim();
    const { preferences } = JSON.parse(rawAttr);

    if (!preferences?.length) {
      return res.status(500).json({ error: "No wine attributes returned." });
    }

    // === Stage 2: Fetch candidate bottles in parallel ===
    // Use Mongoose lean() for plain JS objects and proper indexing on wineType, region, grapeType
    const perPref = Math.floor(50 / preferences.length);
    const finds = preferences.map(pref => {
      const regex = str => str ? new RegExp(str, "i") : /.*/;
      return Bottle.find({
        wineType: regex(pref.wineType),
        region: regex(pref.region),
        grapeType: regex(pref.grapeType)
      })
        .lean()
        .limit(perPref)
        .select("name imageUrl");
    });
    const resultsByPref = await Promise.all(finds);
    let candidateBottles = resultsByPref.flat()
      .filter(b => b.name)
      .map(b => ({ id: b._id.toString(), name: b.name, imageUrl: b.imageUrl }));

    // Fill up to 50 if needed
    if (candidateBottles.length < 50) {
      const extra = await Bottle.find().lean()
        .limit(50 - candidateBottles.length)
        .select("name imageUrl");
      candidateBottles.push(
        ...extra.map(b => ({ id: b._id.toString(), name: b.name, imageUrl: b.imageUrl }))
      );
    }

    // === Stage 3: Final recommendation ===
    const finalPrompt = `
You are an expert sommelier.
Based on these attributes ${JSON.stringify(preferences)} and candidates:
${JSON.stringify(candidateBottles, null, 2)}
Recommend 10 bottles (ID & name) with a brief “explanation” why each matches the user’s tastes.
Exclude any input names.
Return only a JSON array:
[ { "bottleId":"…", "bottleName":"…", "explanation":"…" } ]
    `;
    const rawRec = (await callOpenAI(finalPrompt))
      .replace(/```(json)?/gi, "")
      .trim();
    const recs = JSON.parse(rawRec);

    // Enrich with imageUrl and return
    const enriched = recs.map(r => {
      const b = candidateBottles.find(c => c.id === r.bottleId) || {};
      return { ...r, imageUrl: b.imageUrl || null };
    });

    res.json({ recommendations: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});


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
// test();