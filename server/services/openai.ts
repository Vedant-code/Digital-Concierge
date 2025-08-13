import OpenAI from "openai";
import { Message, ContentCard } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  message: string;
  cards?: ContentCard[];
}

export async function generateChatResponse(
  messages: Message[],
  relevantAssets: string[] = []
): Promise<ChatResponse> {
  try {
    const contextPrompt = relevantAssets.length > 0 
      ? `\n\nRelevant information from our knowledge base:\n${relevantAssets.join('\n\n')}`
      : '';

    const systemMessage = `You are a professional digital concierge assistant for a luxury hotel. You help guests with information about services, amenities, policies, and local attractions. 

When appropriate, provide structured responses with content cards for better visual presentation. For responses about amenities, services, or categorized information, include content cards in your JSON response.

Respond with JSON in this format:
{
  "message": "Your conversational response here",
  "cards": [
    {
      "id": "unique-id",
      "title": "Card Title",
      "description": "Card description",
      "icon": "fas fa-icon-name",
      "color": "color-theme (blue, green, purple, orange, red, yellow, indigo)"
    }
  ]
}

Be helpful, professional, and friendly. Use the provided context information when available.${contextPrompt}`;

    const conversationMessages = messages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        ...conversationMessages
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"message": "I apologize, but I encountered an error processing your request."}');
    
    return {
      message: result.message,
      cards: result.cards || []
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
    };
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a temporary file-like object for the audio buffer
    const audioFile = new File([audioBuffer], "audio.webm", { type: "audio/webm" });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}
