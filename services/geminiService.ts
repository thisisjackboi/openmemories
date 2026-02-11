
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: any;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("Gemini API Key missing! AI features will be disabled.");
}

export async function suggestCaption(topic: string, emotion: string): Promise<string> {
  try {
    if (!ai) return "A beautiful moment shared together (AI Disabled)";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a short, cute, and romantic caption (max 15 words) for a couple's memory about "${topic}". The mood is ${emotion}. Make it feel warm and sincere.`,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8,
      }
    });
    return response.text?.trim() || "A beautiful moment shared together.";
  } catch (error) {
    console.error("Gemini failed:", error);
    return "Sharing life's best moments with you.";
  }
}

export async function polishNote(rawNote: string): Promise<string> {
  try {
    if (!ai) return rawNote;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite this short romantic note to be more poetic but keep it under 30 words: "${rawNote}". Maintain the original sentiment.`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    });
    return response.text?.trim() || rawNote;
  } catch (error) {
    console.error("Gemini failed:", error);
    return rawNote;
  }
}
