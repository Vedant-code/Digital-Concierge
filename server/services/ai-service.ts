import { Message, ContentCard } from "@shared/schema";

export interface ChatResponse {
  message: string;
  cards?: ContentCard[];
}

// Simple lightweight AI service for demonstrations
// In production, you would connect to Hugging Face, Ollama, or other open-source models
export class AIService {
  private responses = {
    greeting: [
      "Hello! I'm your Digital Concierge. How can I assist you today?",
      "Welcome! I'm here to help with any questions about our services.",
      "Good day! How may I help you with your stay?"
    ],
    amenities: {
      message: "Here are our available amenities and facilities:",
      cards: [
        {
          id: "pool",
          title: "Indoor Pool",
          description: "Open 6 AM - 10 PM daily. Heated pool with poolside service.",
          icon: "fas fa-swimming-pool",
          color: "blue"
        },
        {
          id: "fitness",
          title: "Fitness Center",
          description: "24/7 access with modern equipment and personal training available.",
          icon: "fas fa-dumbbell",
          color: "green"
        },
        {
          id: "spa",
          title: "Spa Services",
          description: "Full-service spa open 9 AM - 8 PM. Massages, facials, and wellness treatments.",
          icon: "fas fa-spa",
          color: "purple"
        },
        {
          id: "dining",
          title: "Restaurant & Bar",
          description: "Fine dining restaurant and rooftop bar with city views.",
          icon: "fas fa-utensils",
          color: "orange"
        }
      ]
    },
    checkin: {
      message: "Here's information about check-in and check-out:",
      cards: [
        {
          id: "checkin-time",
          title: "Check-in Time",
          description: "3:00 PM standard check-in. Early check-in available upon request.",
          icon: "fas fa-clock",
          color: "blue"
        },
        {
          id: "checkout-time", 
          title: "Check-out Time",
          description: "11:00 AM standard check-out. Late check-out available for a fee.",
          icon: "fas fa-sign-out-alt",
          color: "red"
        }
      ]
    },
    attractions: {
      message: "Here are popular local attractions near our hotel:",
      cards: [
        {
          id: "central-park",
          title: "Central Park",
          description: "Just 0.2 miles away. Perfect for morning walks and outdoor activities.",
          icon: "fas fa-tree",
          color: "green"
        },
        {
          id: "museum",
          title: "Metropolitan Museum",
          description: "0.5 miles away. World-class art and cultural exhibitions.",
          icon: "fas fa-university",
          color: "purple"
        },
        {
          id: "broadway",
          title: "Broadway Theater District",
          description: "0.3 miles away. Catch the latest shows and performances.",
          icon: "fas fa-theater-masks",
          color: "yellow"
        }
      ]
    },
    default: "I'd be happy to help! Could you please be more specific about what information you're looking for?"
  };

  async generateResponse(messages: Message[], relevantAssets: string[] = []): Promise<ChatResponse> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return { message: this.responses.default };
    }

    const content = lastMessage.content.toLowerCase();

    // Simple pattern matching for demo purposes
    if (this.containsWords(content, ["hello", "hi", "hey", "greetings"])) {
      return { message: this.getRandomResponse(this.responses.greeting) };
    }

    if (this.containsWords(content, ["amenities", "facilities", "services", "what", "available"])) {
      return this.responses.amenities;
    }

    if (this.containsWords(content, ["check", "time", "checkin", "checkout"])) {
      return this.responses.checkin;
    }

    if (this.containsWords(content, ["attractions", "local", "nearby", "visit", "see", "tourist"])) {
      return this.responses.attractions;
    }

    if (this.containsWords(content, ["room service", "dining", "restaurant", "food"])) {
      return {
        message: "Our room service is available 24/7, and our restaurant serves breakfast (7-11 AM), lunch (12-3 PM), and dinner (6-10 PM).",
        cards: [{
          id: "room-service",
          title: "24/7 Room Service",
          description: "Full menu available around the clock. Call extension 1234 to order.",
          icon: "fas fa-concierge-bell",
          color: "blue"
        }]
      };
    }

    // Use relevant assets if available
    if (relevantAssets.length > 0) {
      return {
        message: `Based on our hotel information: ${relevantAssets[0]}. Is there anything specific you'd like to know more about?`
      };
    }

    return { message: this.responses.default };
  }

  private containsWords(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const aiService = new AIService();