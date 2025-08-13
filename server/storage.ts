import { type User, type InsertUser, type Asset, type InsertAsset, type Conversation, type InsertConversation, type Message } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAssets(): Promise<Asset[]>;
  getAssetsByCategory(category: string): Promise<Asset[]>;
  searchAssets(query: string): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, messages: Message[]): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assets: Map<string, Asset>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.assets = new Map();
    this.conversations = new Map();
    
    // Initialize with sample assets
    this.initializeAssets();
  }

  private initializeAssets() {
    const sampleAssets: InsertAsset[] = [
      {
        title: "Hotel Policies",
        description: "Guest guidelines and procedures",
        content: "Check-in time is 3:00 PM, check-out is 11:00 AM. Guests must present valid ID and credit card at check-in. No smoking policy throughout the property.",
        category: "Documents",
        tags: ["policy", "guest", "guidelines"],
        icon: "fas fa-file-text"
      },
      {
        title: "Amenities Guide",
        description: "Complete list of hotel amenities",
        content: "Indoor pool (6 AM - 10 PM), Fitness center (24/7), Spa services (9 AM - 8 PM), Free WiFi, Business center, Concierge services, Room service, Restaurant, Bar, Parking",
        category: "Documents",
        tags: ["amenities", "services", "facilities"],
        icon: "fas fa-concierge-bell"
      },
      {
        title: "Property Photos",
        description: "Room and amenity images",
        content: "High-quality images showcasing our luxury suites, elegant lobby, spa facilities, dining areas, and outdoor spaces.",
        category: "Images",
        tags: ["photos", "rooms", "facilities"],
        icon: "fas fa-image"
      },
      {
        title: "Response Templates",
        description: "Pre-written response patterns",
        content: "Template responses for common guest inquiries about reservations, amenities, local attractions, and services.",
        category: "Templates",
        tags: ["templates", "responses"],
        icon: "fas fa-clipboard-list"
      },
      {
        title: "Local Attractions",
        description: "Nearby points of interest",
        content: "Central Park (0.2 miles), Metropolitan Museum (0.5 miles), Broadway Theater District (0.3 miles), Times Square (0.4 miles), Empire State Building (0.8 miles)",
        category: "Documents",
        tags: ["attractions", "local", "tourism"],
        icon: "fas fa-map-marker-alt"
      }
    ];

    sampleAssets.forEach(asset => {
      this.createAsset(asset);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetsByCategory(category: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.category === category);
  }

  async searchAssets(query: string): Promise<Asset[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.assets.values()).filter(asset => 
      asset.title.toLowerCase().includes(lowercaseQuery) ||
      asset.description?.toLowerCase().includes(lowercaseQuery) ||
      asset.content.toLowerCase().includes(lowercaseQuery) ||
      (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      id,
      title: insertAsset.title,
      content: insertAsset.content,
      category: insertAsset.category,
      description: insertAsset.description || null,
      tags: Array.isArray(insertAsset.tags) ? insertAsset.tags : [],
      icon: insertAsset.icon || "fas fa-file-text",
      createdAt: new Date()
    };
    this.assets.set(id, asset);
    return asset;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      id,
      messages: Array.isArray(insertConversation.messages) ? insertConversation.messages : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, messages: Message[]): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    const updated: Conversation = {
      ...conversation,
      messages,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
