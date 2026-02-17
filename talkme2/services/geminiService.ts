
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { getTutorSystemPrompt } from "../constants";
import { CEFRLevel, Language, TutorFeedback } from "../types";

// The API key is injected via environment variables.
const API_KEY = import.meta.env.VITE_API_KEY as string;

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!API_KEY) {
      console.error("⚠️ VITE_API_KEY not found in environment");
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  async generateResponse(
    message: string,
    level: CEFRLevel,
    language: Language,
    history: { role: 'user' | 'model', parts: { text: string }[] }[]
  ): Promise<TutorFeedback> {
    const systemInstruction = getTutorSystemPrompt(level, language);

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            response_text: { type: SchemaType.STRING },
            corrections: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            grammar_tip: { type: SchemaType.STRING },
            vocabulary_check: { type: SchemaType.STRING }
          },
          required: ["response_text"]
        }
      }
    });

    try {
      const chat = model.startChat({
        history: history
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      return JSON.parse(responseText || '{}') as TutorFeedback;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return { response_text: "I'm sorry, I had trouble processing that. Can you repeat?" };
    }
  }

  async generateSpeech(text: string): Promise<Uint8Array> {
    // Fallback to Google Translate TTS since Gemini TTS is not available in the standard SDK
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (error) {
      console.error("TTS error:", error);
      throw new Error("No audio generated");
    }
  }
}

export const gemini = new GeminiService();
