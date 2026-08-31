import { GoogleGenAI } from '@google/genai';

/** Tried in order; first success wins. Aliases self-update as Google rotates models. */
const MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
];

export async function generateProductDescription(
  name: string,
  keywords: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in your environment');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt =
    `Write a short, appealing e-commerce product description ` +
    `(2-3 sentences, no headings or markdown) for a product called "${name}". ` +
    `Highlight these qualities: ${keywords}. Use a warm, boutique tone.`;

  let lastError: unknown;
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      const text = response.text ?? '';
      if (text) return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('No Gemini model produced a description');
}
