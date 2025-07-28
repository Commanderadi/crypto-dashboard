import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzePortfolio(holdings) {
  const prompt = `Analyze this crypto portfolio and suggest improvements:\n${JSON.stringify(holdings)}`;
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return "AI analysis failed. Try again later.";
  }
}
