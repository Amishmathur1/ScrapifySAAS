export async function getChatCompletion(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat completion');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
} 