import type { VercelRequest, VercelResponse } from '@vercel/node';
import { aiService } from '../server/services/ai-service';
import { MemStorage } from '../server/storage';

const memStorage = new MemStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate AI response
    const response = await aiService.generateResponse(message);

    // Create conversation data structure to match expected format
    const conversation = {
      id: conversationId || crypto.randomUUID(),
      messages: [
        {
          id: crypto.randomUUID(),
          conversationId: conversationId || crypto.randomUUID(),
          content: message,
          sender: 'user' as const,
          timestamp: new Date()
        },
        {
          id: crypto.randomUUID(),
          conversationId: conversationId || crypto.randomUUID(),
          content: response.message,
          sender: 'assistant' as const,
          timestamp: new Date(),
          cards: response.cards
        }
      ]
    };

    res.json(conversation);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}