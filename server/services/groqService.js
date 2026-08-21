import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Pastikan path .env terbaca akurat di folder server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const SYSTEM_PROMPT = `You are a Principal Architect & Senior Structural/Civil Engineer with world-class expertise in high-end, bespoke residential and commercial architecture ("Engineering Meets Art").

When answering the user's architectural or structural questions:
1. Provide deep technical insight combining structural physics, aesthetic elegance, and practical buildability.
2. Recommend curated, high-end materials that fit the structural requirements and aesthetic context.

You MUST respond strictly with a valid JSON object adhering to this exact schema:
{
  "message": "Detailed, professional architectural advice and rationale.",
  "suggestedMaterials": [
    {
      "name": "Material Name (e.g., Ultra-High-Performance Concrete (UHPC))",
      "physics": "Load-bearing, tensile/compressive strength, thermal mass, or acoustic properties",
      "durability": "Weathering, corrosion resistance, lifecycle expectancy, and maintenance profile",
      "styleFit": "Visual texture, light interaction, patina, and synergy with modern luxury design"
    }
  ]
}

Ensure "suggestedMaterials" is an array. If no materials are strictly applicable, provide an empty array []. Output purely the JSON object with no markdown fences, no preamble, and no postscript.`;

/**
 * Request architectural consultation from Groq with strict JSON output formatting.
 */
export const getGroqChatCompletion = async (userMessage) => {
  if (!userMessage || typeof userMessage !== 'string') {
    throw new Error('Invalid input: userMessage must be a non-empty string.');
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.error('[GroqService Error]: GROQ_API_KEY tidak ditemukan di server/.env!');
    throw new Error('GROQ_API_KEY is missing in server/.env');
  }

  try {
    const groq = new Groq({ apiKey: apiKey.trim() });

    console.log('[GroqService] Mengirim request ke model llama-3.1-8b-instant...');

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 2048,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Received empty response from Groq LLM.');
    }

    const parsedData = JSON.parse(content);

    return {
      message: parsedData.message || '',
      suggestedMaterials: Array.isArray(parsedData.suggestedMaterials)
        ? parsedData.suggestedMaterials
        : [],
    };
  } catch (error) {
    console.error('[GroqService API Error]:', error.message);
    throw error;
  }
};