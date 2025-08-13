import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/ai-service";
import { vectorStore } from "./services/vector-store";
import { insertAssetSchema, type Message, type AssetCategory } from "@shared/schema";
import { randomUUID } from "crypto";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize vector store with assets
  const assets = await storage.getAssets();
  vectorStore.addDocuments(assets);
  
  // Get all assets grouped by category
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      const categories: Record<string, AssetCategory> = {};
      
      assets.forEach(asset => {
        if (!categories[asset.category]) {
          categories[asset.category] = {
            name: asset.category,
            count: 0,
            items: []
          };
        }
        categories[asset.category].items.push(asset);
        categories[asset.category].count++;
      });
      
      res.json(Object.values(categories));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Search assets
  app.get("/api/assets/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const assets = await storage.searchAssets(q);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to search assets" });
    }
  });

  // Create new asset
  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.json(asset);
    } catch (error) {
      res.status(400).json({ message: "Invalid asset data" });
    }
  });

  // Send chat message
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // Create user message
      const userMessage: Message = {
        id: randomUUID(),
        role: "user",
        content: message.trim(),
        timestamp: new Date().toISOString(),
        type: "text"
      };

      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      } else {
        conversation = await storage.createConversation({ messages: [] });
      }

      // Add user message to conversation
      const messages = [...(conversation.messages || []), userMessage];

      // Search for relevant assets using vector store
      const relevantAssets = vectorStore.search(message, 3);
      const assetContext = relevantAssets.map(asset => 
        `${asset.title}: ${asset.content}`
      );

      // Generate AI response
      const aiResponse = await aiService.generateResponse(messages, assetContext);
      
      const assistantMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
        type: "text",
        cards: aiResponse.cards
      };

      // Update conversation with both messages
      const updatedMessages = [...messages, assistantMessage];
      await storage.updateConversation(conversation.id, updatedMessages);

      res.json({
        conversationId: conversation.id,
        message: assistantMessage,
        relevantAssets: relevantAssets
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Simple transcription placeholder (would integrate with Whisper.cpp or similar)
  app.post("/api/transcribe", upload.single('audio'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      // For demo purposes, return a placeholder response
      // In production, integrate with Whisper.cpp, OpenAI Whisper, or similar
      res.json({ text: "Voice input received - transcription would be processed here" });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
