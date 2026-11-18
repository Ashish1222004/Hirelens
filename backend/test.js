
import "dotenv/config";
import { generateAIResponse } from "./services/gemini.service.js";

const testGemini = async () => {
  try {
    const response = await generateAIResponse(
      "Explain what a REST API is in one sentence."
    );

    console.log("Gemini Response:", response);
  } catch (error) {
    console.error("Gemini API Error:", error.message);
  }
};

testGemini();
