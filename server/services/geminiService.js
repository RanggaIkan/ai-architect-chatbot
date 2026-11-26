import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const SYSTEM_PROMPT = `You are a Principal Architect & Senior Structural/Civil Engineer with world-class expertise in high-end, bespoke residential and commercial architecture ("Engineering Meets Art").

When answering the user's architectural or structural questions:
1. Provide deep technical insight combining structural physics, aesthetic elegance, and practical buildability.
2. Recommend curated, high-end materials that fit the structural requirements and aesthetic context.

You MUST respond strictly with a valid JSON object adhering to the configured schema with "message" and "suggestedMaterials". If no materials are strictly applicable, return an empty array for "suggestedMaterials".`;

const ARCHITECT_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description: 'Detailed, professional architectural advice and structural rationale.',
    },
    suggestedMaterials: {
      type: 'array',
      description: 'Curated list of architectural and structural materials tailored to the consultation.',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          physics: { type: 'string' },
          durability: { type: 'string' },
          styleFit: { type: 'string' },
        },
        required: ['name', 'physics', 'durability', 'styleFit'],
      },
    },
  },
  required: ['message', 'suggestedMaterials'],
};

const MODEL_CHAIN = [
  process.env.GEMINI_PRIMARY_MODEL || 'gemini-4-hydrogen',
  process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
].filter((model, index, list) => Boolean(model) && list.indexOf(model) === index);

function isRetryableModelError(error) {
  const status = error?.status ?? error?.statusCode ?? error?.code;
  if ([429, 500, 502, 503, 504].includes(Number(status))) {
    return true;
  }
  const msg = String(error?.message || '').toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable') ||
    msg.includes('503')
  );
}

function parseStructuredOutput(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Received empty response from Gemini API.');
  }

  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      message: typeof parsed.message === 'string' ? parsed.message : cleaned,
      suggestedMaterials: Array.isArray(parsed.suggestedMaterials)
        ? parsed.suggestedMaterials
        : [],
    };
  } catch {
    return {
      message: cleaned,
      suggestedMaterials: [],
    };
  }
}

/**
 * Request architectural consultation from Google Gemini Interactions API
 * with strict JSON schema output and automatic free-tier fallback chain.
 */
export const getGeminiArchitecturalConsultation = async (userMessage) => {
  if (!userMessage || typeof userMessage !== 'string') {
    throw new Error('Invalid input: userMessage must be a non-empty string.');
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error('[GeminiService Error]: GEMINI_API_KEY is missing in server/.env!');
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.statusCode = 500;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError = null;

  for (let i = 0; i < MODEL_CHAIN.length; i += 1) {
    const model = MODEL_CHAIN[i];
    try {
      const generationConfig = { max_output_tokens: 2048 };
      if (model === 'gemini-4-hydrogen') {
        generationConfig.thinking_level = 'low';
      }

      const interaction = await ai.interactions.create({
        model,
        input: userMessage,
        system_instruction: SYSTEM_PROMPT,
        store: false,
        generation_config: generationConfig,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: ARCHITECT_RESPONSE_SCHEMA,
        },
      });

      const data = parseStructuredOutput(interaction.output_text);
      return {
        data,
        meta: {
          model,
          fallbackUsed: i > 0,
        },
      };
    } catch (error) {
      lastError = error;
      console.error(`[GeminiService] Model "${model}" failed:`, error?.message || error);
      const hasNext = i < MODEL_CHAIN.length - 1;
      if (!hasNext || !isRetryableModelError(error)) {
        break;
      }
      console.warn(`[GeminiService] Falling back to "${MODEL_CHAIN[i + 1]}"...`);
    }
  }

  throw lastError || new Error('All Gemini models failed to respond.');
};
