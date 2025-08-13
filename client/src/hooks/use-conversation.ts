import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Message } from "@shared/schema";
// Browser-compatible UUID generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface ChatResponse {
  conversationId: string;
  message: Message;
  relevantAssets: any[];
}

export function useConversation() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();

  const chatMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        conversationId,
      });
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Update messages with assistant message only (user message was already added)
      setMessages(prev => [...prev, data.message]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateUUID(),
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        type: "text"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      id: generateUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ message: content });
  };

  return {
    messages,
    sendMessage,
    isLoading: chatMutation.isPending,
    conversationId,
    error: chatMutation.error
  };
}
