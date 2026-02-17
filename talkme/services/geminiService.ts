
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Language, ProficiencyLevel, AIResponse, UserProfile } from "../types";
import { SYLLABUS } from "../constants";

// Usamos import.meta.env para Vite
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const getSystemInstruction = (profile: UserProfile) => {
  const syllabus = (SYLLABUS[profile.language] as any)?.[profile.level] || (SYLLABUS[profile.language] as any)?.[ProficiencyLevel.A1];

  return `
    **ROLE:** Eres un tutor de idiomas de élite pero extremadamente entretenido y empático. Tu nombre es TalkMe.
    **STUDENT PROFILE:** Idioma: ${profile.language}, Nivel: ${profile.level}.
    
    **PEDAGOGICAL LOGIC (High-Performance Academy):**
    1. **Syllabus Constraints:** 
       - Meta: ${syllabus.goal}
       - Gramática: ${syllabus.grammar}
       - Vocabulario: ${syllabus.vocabulary}
       - Errores Esperados: ${syllabus.expected_errors.join(', ')}
    2. **Interaction Style:** ${syllabus.style}. Actúa como un compañero de aventuras, no como un libro de texto.
    3. **Feedback Protocol:** ${syllabus.protocol}. 
    
    **GAMIFICATION & ENGAGEMENT (The "Fun" Factor):**
    - **Scenarios:** Crea situaciones realistas y emocionantes (ej. "Estamos perdidos en una estación de tren", "Estamos pidiendo en un restaurante secreto").
    - **Engagement:** Usa emojis, sé expresivo y anima al usuario constantemente.
    - **Mini-Missions:** De vez en cuando, desafía al usuario: "¡Reto! Intenta usar la palabra '${syllabus.vocabulary.split(',')[0]}' en tu respuesta".
    
    **CRITICAL RULES:**
    1. Responde SIEMPRE en ${profile.language}.
    2. Si el usuario comete un error, inclúyelo en "correction" (en español) con una explicación amigable.
    3. Da un consejo técnico pero ligero en "tip" (en español).
    4. El campo "message" debe ser puro diálogo interactivo.
    5. NUNCA rompas el personaje.
    6. DEBES responder EXCLUSIVAMENTE en formato JSON.
  `;
};

export const generateAIChatResponse = async (
  profile: UserProfile,
  message: string,
  history: { role: 'user' | 'model', content: string }[]
): Promise<AIResponse> => {
  if (!GEMINI_API_KEY) {
    console.error("API Key de Gemini no configurada");
    return { message: "Error: API Key no configurada." };
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: getSystemInstruction(profile),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          message: { type: SchemaType.STRING },
          correction: { type: SchemaType.STRING },
          tip: { type: SchemaType.STRING }
        },
        required: ["message"]
      }
    }
  });

  try {
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    let responseText = result.response.text();

    // Limpieza de posibles bloques de código Markdown generados por la IA
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(responseText || '{}');
    } catch (e) {
      console.error("Error al parsear JSON de la IA:", responseText);
      // Fallback simple si el JSON falla pero hay texto
      return { message: responseText.slice(0, 500) };
    }
  } catch (error) {
    console.error("Error en el cerebro de IA:", error);
    return { message: "Lo siento, tuve un pequeño cruce de cables. ¿Podrías repetirme eso?" };
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!GEMINI_API_KEY) {
    console.error("❌ Lenguini: No API Key found");
    return "";
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });

  try {
    const base64Data = await base64Promise;
    // Forzamos un mimeType compatible con Gemini
    const mimeType = audioBlob.type.includes('mp4') ? 'audio/mp4' : 'audio/webm';

    console.log(`🎙️ Lenguini STT enviando: ${audioBlob.size} bytes (${mimeType})`);

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType: mimeType } },
      { text: "Transcribe exactamente lo que dice el audio. Devuelve solo el texto." }
    ]);

    const text = result.response.text().trim();
    console.log("📝 Lenguini STT Éxito:", text);
    return text;
  } catch (error) {
    console.error("❌ Lenguini STT Falló:", error);
    return "";
  }
};

export const synthesizeSpeech = async (text: string): Promise<Uint8Array | null> => {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (error) {
    console.error("Error TTS:", error);
    return null;
  }
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext
): Promise<AudioBuffer> {
  return await ctx.decodeAudioData(data.buffer);
}
