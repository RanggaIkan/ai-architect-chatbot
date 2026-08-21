import Groq from 'groq-sdk';

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

export const sendArchitectMessage = async (userMessage) => {
  if (!userMessage || typeof userMessage !== 'string') {
    throw new Error('Invalid input: userMessage must be a non-empty string.');
  }

  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('REACT_APP_GROQ_API_KEY is missing in environment variables.');
  }

  const groq = new Groq({ 
    apiKey: apiKey.trim(),
    dangerouslyAllowBrowser: true 
  });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 2048,
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Received empty response from Groq LLM.');
  }

  try {
    const parsedData = JSON.parse(content);
    return {
      message: parsedData.message || '',
      suggestedMaterials: Array.isArray(parsedData.suggestedMaterials) ? parsedData.suggestedMaterials : [],
    };
  } catch (parseError) {
    return {
      message: content,
      suggestedMaterials: [],
    };
  }
};