const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Sends a message to the AI Architect Chatbot backend.
 * @param {string} message - User's prompt / query.
 * @returns {Promise<{ message: string, suggestedMaterials: Array }>} Structured AI response.
 */
export const sendChatMessage = async (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result.data;
  } catch (error) {
    console.error('[API Service Error]: Failed to send chat message:', error);
    throw error;
  }
};
