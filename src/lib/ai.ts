import { GoogleGenAI } from '@google/genai';

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

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  return response.text ?? '';
}
