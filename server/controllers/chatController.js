import { getGroqChatCompletion } from '../services/groqService.js';

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

    const aiResponse = await getGroqChatCompletion(message.trim());

    return res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    console.error('[ChatController Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing the architectural consultation.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
