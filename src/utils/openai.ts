import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, calls should go through your backend
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatCompletion(messages: ChatMessage[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export async function generateSystemPrompt(messages: ChatMessage[]): Promise<string> {
  try {
    const promptGenerationMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert at analyzing conversations and generating system prompts. 
        Based on the conversation history provided, create a comprehensive system prompt that:
        1. Captures the key requirements and constraints discussed
        2. Defines clear behavioral guidelines and objectives
        3. Incorporates any specific capabilities or limitations mentioned
        4. Maintains a professional and focused tone
        
        Return ONLY the system prompt text, without any explanations or metadata.`
      },
      {
        role: 'user',
        content: `Please analyze this conversation and generate an optimized system prompt:\n\n${
          messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
        }`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: promptGenerationMessages,
      temperature: 0.7,
    });

    return completion.choices[0].message?.content || '';
  } catch (error) {
    console.error('Failed to generate system prompt:', error);
    throw new Error('Failed to generate system prompt');
  }
}
