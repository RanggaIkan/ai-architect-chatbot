import { getGeminiArchitecturalConsultation } from '../services/geminiService.js';

const MAX_MESSAGE_LENGTH = 4000;

/**
 * Handle incoming architectural chat consultation requests.
 * @route POST /api/chat
 */
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: A non-empty "message" string is required in the request body.',
      });
    }

    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Validation Error: Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    const { data, meta } = await getGeminiArchitecturalConsultation(message.trim());

    return res.status(200).json({
      success: true,
      data,
      meta,
    });
  } catch (error) {
    console.error('[ChatController Error]:', error);
    const status = error?.statusCode || (String(error?.message || '').includes('429') ? 429 : 500);
    return res.status(status).json({
      success: false,
      error:
        status === 429
          ? 'The AI studio is temporarily busy due to high demand. Please retry in a moment.'
          : 'An error occurred while processing the architectural consultation.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
