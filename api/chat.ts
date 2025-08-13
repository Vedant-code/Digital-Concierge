import type { VercelRequest, VercelResponse } from '@vercel/node';
import { aiService } from '../server/services/ai-service';
import { memStorage } from '../server/storage';

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

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await memStorage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = await memStorage.createConversation();
    }

    // Add user message
    await memStorage.addMessage({
      conversationId: conversation.id,
      content: message,
      sender: 'user',
      timestamp: new Date()
    });

    // Get AI response
    const response = await aiService.processMessage(message, conversation.id);

    // Add AI response
    await memStorage.addMessage({
      conversationId: conversation.id,
      content: response.text,
      sender: 'assistant',
      timestamp: new Date(),
      cards: response.cards
    });

    // Get updated conversation
    const updatedConversation = await memStorage.getConversation(conversation.id);

    res.json(updatedConversation);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}