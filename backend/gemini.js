import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock_key');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 1 && month <= 3) return 'Rabi';
  if (month >= 4 && month <= 6) return 'Summer';
  if (month >= 7 && month <= 9) return 'Kharif';
  return 'Rabi';
}

export async function generateChallenges(farmerProfile) {
  const {
    name, cropType, stage, farmSize,
    district, state, soilType, irrigationType,
    previousCrop, sowingDate
  } = farmerProfile;

  const currentSeason = getCurrentSeason();

  const prompt = `
  You are an expert agronomist specializing in organic farming in India. Give practical, safe, specific advice.

  Farmer profile:
  - Name: ${name}
  - Crop: ${cropType}
  - Growth stage: ${stage}
  - Farm size: ${farmSize} acres
  - Location: ${district}, ${state}
  - Soil type: ${soilType}
  - Irrigation: ${irrigationType}
  - Sowing date: ${sowingDate}
  - Previous crop: ${previousCrop}
  - Current season: ${currentSeason}

  Generate exactly 3 organic farming challenges for today.
  Each must be:
  1. Specific to this crop and growth stage
  2. Doable in one day on a small farm
  3. Genuinely improve organic farming outcomes
  4. Safe — never recommend anything that could damage crops if done incorrectly

  Respond ONLY with raw JSON. No markdown, no code blocks, no explanation. Just the JSON object:
  {
    "challenges": [
      {
        "id": "ch_[random 6 chars]",
        "emoji": "single relevant emoji",
        "title": "max 6 words",
        "description": "2-3 sentences, specific instructions",
        "category": "Water|Soil|Pest|Biodiversity|Energy",
        "points": 80-200,
        "estimatedTime": "X mins/hours",
        "tip": "one pro tip sentence",
        "verificationPrompt": "what photo proves completion"
      }
    ]
  }`;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('No valid Gemini key');
    }
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini challenge generation failed:", error.message);
    return null; // Trigger static fallback in route
  }
}

export async function generatePostInsight(postBody) {
  const prompt = `
  A farmer posted this in an agricultural community app:
  "${postBody}"

  Write exactly 1 sentence (max 20 words) giving a useful agronomic insight or encouragement about what they shared.
  Be factual and supportive.
  Plain text only. No formatting, no quotes.`;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('No valid Gemini key');
    }
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini insight generation failed:", error.message);
    return null;
  }
}

export async function suggestFertilizers(cropType, soilType, district, state) {
  const prompt = `
  You are an expert agronomist specializing in organic farming in India.

  Farmer profile:
  - Crop: ${cropType}
  - Location: ${district}, ${state}
  - Soil type: ${soilType}

  Suggest exactly 3 organic fertilizers that are best suited for this specific crop. 

  Respond ONLY with raw JSON. No markdown, no code blocks, no explanation. Just the JSON object:
  {
    "fertilizers": [
      {
        "id": "fert_[random 6 chars]",
        "name": "Name of organic fertilizer (e.g. Vermicompost, Neem Cake)",
        "emoji": "single relevant emoji",
        "benefits": "1 short sentence explaining why it's good for this crop",
        "usage": "General instructions on how to use it for this crop"
      }
    ]
  }`;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('No valid Gemini key');
    }
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini fertilizer suggestion failed:", error.message);
    return null;
  }
}
