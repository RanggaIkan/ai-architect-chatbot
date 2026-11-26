const API_BASE_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/$/, '');

/**
 * Sends a message to the server-side AI Architect Chatbot API.
 * Keeps GEMINI_API_KEY strictly on the server (Vercel Function / Express backend).
 * @param {string} message - User's prompt / architectural query.
 * @returns {Promise<{ message: string, suggestedMaterials: Array, model?: string }>}
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

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Request failed with status ${response.status}`);
    }

    return {
      message: result.data?.message || '',
      suggestedMaterials: Array.isArray(result.data?.suggestedMaterials)
        ? result.data.suggestedMaterials
        : [],
      model: result.meta?.model || null,
    };
  } catch (error) {
    console.error('[API Service Error]: Failed to send chat message:', error);
    throw error;
  }
};
