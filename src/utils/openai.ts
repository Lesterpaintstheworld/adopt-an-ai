export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatCompletion(messages: ChatMessage[]) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const completion = await response.json();
    return completion.choices[0].message;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
}

export async function generateSystemPrompt(messages: ChatMessage[]): Promise<string> {
  try {
    const promptGenerationMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert at analyzing conversations and generating system prompts.
        Your next response must ONLY contain the system prompt text for the new KIN to be created.
        Do not include any explanations, metadata, or other text.
        Do not use phrases like "Here's the system prompt:" or "System prompt:".
        Just output the raw system prompt text that will define the new KIN's behavior.
        
        Based on the conversation history provided:
        1. Extract key requirements and constraints discussed
        2. Define clear behavioral guidelines and objectives
        3. Incorporate specific capabilities or limitations mentioned
        4. Maintain a professional and focused tone
        
        Remember: Your entire response should be ONLY the system prompt text that will be used directly.`
      },
      {
        role: 'user',
        content: `Based on this conversation, generate the system prompt for the new KIN:\n\n${
          messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
        }`
      }
    ];

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messages: promptGenerationMessages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const completion = await response.json();
    return completion.choices[0].message?.content || '';
  } catch (error) {
    console.error('Failed to generate system prompt:', error);
    throw new Error('Failed to generate system prompt');
  }
}
