import { GoogleGenAI } from "@google/genai";
import { AppMode } from '../types';
import { PMCK_DOCTORS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

const generateSystemInstruction = (): string => {
  const doctorProfiles = PMCK_DOCTORS.map(doc => 
    `- Dr. ${doc.name}, Specialty: ${doc.specialty}. Bio: ${doc.bio}`
  ).join('\n');

  return `You are a highly knowledgeable and helpful AI assistant for the PMCK Medical Center. Your primary role is to assist a health article writer.
  
  **CRITICAL RULES:**
  1.  **Absolute Source Constraint:** Your ONLY source of information is the provided list of PMCK doctors below. You MUST base all your answers, suggestions, and information strictly on this list.
  2.  **No External Information:** Do NOT invent doctors, use external medical sources, or mention specialists not on this list. Under no circumstances should you mention a doctor not present in this list. If a suitable doctor for a query cannot be found, state that clearly and suggest a specialty that might be relevant.
  3.  **Adopt a Persona:** When answering a question or providing a tip, you MUST adopt the persona of the most relevant doctor from the list. Start your response by identifying the doctor, for example: "As Dr. A. Mahdevan, a cardiologist at PMCK, I would advise...".
  4.  **Clarity and Safety:** Keep your language clear, concise, and easy to understand for a general audience. Always include the mandatory disclaimer at the end of your response.
  5.  **Formatting:** Use markdown for better readability (e.g., bolding, bullet points).

  **List of PMCK Doctors (Your ONLY Source of Truth):**
  ${doctorProfiles}
  `;
};

const generatePrompt = (mode: AppMode, input: string): string => {
  switch (mode) {
    case AppMode.ASK_QUESTION:
      return `
        A user has a question for the "Ask The Doctor" series. Based on the provided doctor list, identify the most suitable specialist and answer the following question from their perspective.
        Question: "${input}"
      `;
    case AppMode.VERIFY_ARTICLE:
      return `
        A writer has submitted an article snippet and wants to verify the quoted doctor. Analyze the snippet, identify the medical topic, and determine if the quoted doctor is the correct specialist from the PMCK list.
        - If correct, confirm it and briefly explain why their specialty is relevant.
        - If incorrect, gently correct it by suggesting the most appropriate PMCK doctor and explain the reasoning.
        Article Snippet: "${input}"
      `;
    case AppMode.FIND_DOCTOR:
      return `
        A user is asking for a doctor recommendation based on a health condition. Identify the best PMCK specialist for the following issue and explain why they are a good fit.
        Condition: "${input}"
      `;
    case AppMode.HEALTH_TIP:
      return `
        Generate a single, concise, and actionable "Health Tip of the Day". Attribute it to one of the PMCK doctors from the list, ensuring their specialty is relevant to the tip.
      `;
    default:
      return input;
  }
}

export const runQuery = async (mode: AppMode, input: string): Promise<string> => {
  try {
    const systemInstruction = generateSystemInstruction();
    const userPrompt = generatePrompt(mode, input);

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    const text = response.text.trim();
    const disclaimer = "\n\n---\n*Disclaimer: This information is for article writing assistance and general knowledge only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*";
    
    return text + disclaimer;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, but I encountered an error while processing your request. Please check the console for details and try again later.";
  }
};