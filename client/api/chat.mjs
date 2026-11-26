import { GoogleGenAI } from '@google/genai';

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
          name: {
            type: 'string',
            description: 'Material name (e.g., Ultra-High-Performance Concrete (UHPC))',
          },
          physics: {
            type: 'string',
            description: 'Load-bearing, tensile/compressive strength, thermal mass, or acoustic properties',
          },
          durability: {
            type: 'string',
            description: 'Weathering, corrosion resistance, lifecycle expectancy, and maintenance profile',
          },
          styleFit: {
            type: 'string',
            description: 'Visual texture, light interaction, patina, and synergy with modern luxury design',
          },
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

const MAX_MESSAGE_LENGTH = 4000;

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

async function generateArchitectConsultation(userMessage) {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GEMINI_KEY)?.trim();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY (or GEMINI_KEY) is not configured on the server.');
    err.statusCode = 500;
    err.isConfigError = true;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError = null;

  for (let i = 0; i < MODEL_CHAIN.length; i += 1) {
    const model = MODEL_CHAIN[i];
    try {
      const generationConfig = {
        max_output_tokens: 2048,
      };
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
      console.error(`[AI Architect API] Model "${model}" failed:`, error?.message || error);
      const hasNextModel = i < MODEL_CHAIN.length - 1;
      if (!hasNextModel || !isRetryableModelError(error)) {
        break;
      }
      console.warn(`[AI Architect API] Falling back to "${MODEL_CHAIN[i + 1]}"...`);
    }
  }

  throw lastError || new Error('All Gemini models failed to respond.');
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return Response.json(
        { success: false, error: 'Method Not Allowed. Use POST /api/chat.' },
        { status: 405, headers: { Allow: 'POST, OPTIONS' } },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 },
      );
    }

    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return Response.json(
        { success: false, error: 'A non-empty "message" string is required.' },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          success: false,
          error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    try {
      const { data, meta } = await generateArchitectConsultation(message);
      return Response.json(
        {
          success: true,
          data,
          meta,
        },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    } catch (error) {
      console.error('[AI Architect /api/chat Error]:', error);
      const isConfigError = Boolean(error?.isConfigError);
      const isRateLimit = !isConfigError && isRetryableModelError(error);
      const status = isConfigError
        ? 500
        : isRateLimit
          ? 429
          : error?.statusCode || 500;

      return Response.json(
        {
          success: false,
          error: isConfigError
            ? 'Server AI configuration is incomplete (GEMINI_API_KEY is missing in Vercel Environment Variables).'
            : isRateLimit
              ? 'The AI studio is temporarily busy due to high demand. Please retry in a moment.'
              : 'Unable to complete architectural consultation right now. Please try again shortly.',
        },
        { status },
      );
    }
  },
};
