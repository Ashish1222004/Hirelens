
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAIResponse = async (prompt) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
      });

      return response.text;

    } catch (error) {
      const status = error.status || error.code;
      const isUnavailable =
        status === 503 || status === "UNAVAILABLE";

      if (!isUnavailable || attempt === maxAttempts) {
        throw error;
      }

      const delay = 2000 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini unavailable. Retrying in ${delay / 1000}s...`
      );

      await sleep(delay);
    }
  }
};
