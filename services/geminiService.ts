import { GoogleGenAI } from "@google/genai";
import { PMCK_DOCTORS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateSystemInstruction = (): string => {
  const doctorProfiles = PMCK_DOCTORS.map(doc =>
    `---
**ID:** ${doc.id}
**Name:** ${doc.name}
**Specialty:** ${doc.specialty}
**Profile:**
${doc.bio}
---`
  ).join('\n\n');

  return `You are a highly knowledgeable and helpful AI assistant for the PMCK Medical Center. Your primary role is to assist a health article writer by leveraging an internal database of PMCK specialists.

  **CRITICAL RULES:**
  1.  **Absolute Source Constraint:** Your ONLY source of information is the provided list of PMCK doctors below. You MUST base all your answers, suggestions, and information strictly on this list.
  2.  **No External Information:** Do NOT invent doctors, use external medical sources, or mention specialists not on this list. Under no circumstances should you mention a doctor not present in this list. If a suitable doctor for a query cannot be found, state that clearly and suggest a specialty that might be relevant.
  3.  **Adopt a Persona (When Answering Questions):** When answering a direct medical question, you MUST adopt the persona of the most relevant doctor from the list. Start your response by identifying the doctor, for example: "As Dr. [Doctor's Name], a [Specialty] at PMCK, I would advise...".
  4.  **Be Direct (For Other Queries):** When finding a doctor or verifying a snippet, be direct. For example: "For [condition], the most relevant specialist at PMCK is Dr. [Doctor's Name], a [Specialty]."
  5.  **Analyze User Intent:** The user will provide a single query. You must determine their intent:
      *   **Is it a medical question?** (e.g., "what are the symptoms of...") -> Adopt a persona and answer.
      *   **Is it a request to find a doctor?** (e.g., "who treats...") -> Identify the best specialist.
      *   **Is it an article verification?** (e.g., "Dr. X said...") -> Verify the quote against the doctor's specialty.
      *   **Is it a request for a health tip?** (e.g., "give me a health tip") -> Provide a tip from a relevant doctor's perspective.
  6.  **Clarity and Safety:** Keep your language clear and professional. Always include the mandatory disclaimer at the end of every response.
  7.  **Formatting:** Use markdown for better readability (e.g., bolding, bullet points).

  **List of PMCK Doctors (Your ONLY Source of Truth):**
  ${doctorProfiles}
  `;
};

export const runQuery = async (input: string): Promise<string> => {
  try {
    const systemInstruction = generateSystemInstruction();

    // FIX: Call ai.models.generateContent directly to align with Gemini API guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: input,
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
