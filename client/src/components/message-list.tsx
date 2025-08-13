import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { type Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage?: (message: string) => void;
}

const cardColorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  green: "bg-green-50 border-green-200 text-green-900",
  purple: "bg-purple-50 border-purple-200 text-purple-900",
  orange: "bg-orange-50 border-orange-200 text-orange-900",
  red: "bg-red-50 border-red-200 text-red-900",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
};

export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSuggestion = (suggestion: string) => {
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  return (
    <ScrollArea className="flex-1 bg-secondary" ref={scrollRef} data-testid="messages-scroll-area">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="animate-fade-in" data-testid="welcome-message">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-2xl">
                <p className="text-gray-900">
                  Hello! I'm your Digital Concierge. I can help you with information about our services, answer questions, and provide assistance. How can I help you today?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                    onClick={() => handleSuggestion("Tell me about amenities")}
                    data-testid="suggestion-amenities"
                  >
                    Tell me about amenities
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                    onClick={() => handleSuggestion("Room service hours")}
                    data-testid="suggestion-room-service"
                  >
                    Room service hours
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                    onClick={() => handleSuggestion("Local attractions")}
                    data-testid="suggestion-attractions"
                  >
                    Local attractions
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-neutral ml-14 mt-1">Just now</p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`animate-slide-up w-full ${
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }`}
            data-testid={`message-${message.id}`}
          >
            <div className={`flex items-start space-x-4 max-w-4xl ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-gray-300" 
                  : "bg-primary"
              }`}>
                <i className={`${
                  message.role === "user" 
                    ? "fas fa-user text-gray-600" 
                    : "fas fa-robot text-white"
                }`}></i>
              </div>
              
              {/* Message Content */}
              <div
                className={`rounded-2xl p-4 shadow-sm max-w-2xl ${
                  message.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white text-gray-900 rounded-tl-sm"
                }`}
              >
                <p className="mb-3" data-testid={`message-content-${message.id}`}>
                  {message.content}
                </p>
                
                {/* Content Cards */}
                {message.cards && message.cards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {message.cards.map((card) => {
                      const colorClass = cardColorClasses[card.color as keyof typeof cardColorClasses] || cardColorClasses.blue;
                      return (
                        <div
                          key={card.id}
                          className={`border rounded-lg p-3 ${colorClass}`}
                          data-testid={`card-${card.id}`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <i className={`${card.icon} text-current`}></i>
                            <h4 className="font-medium" data-testid={`card-title-${card.id}`}>
                              {card.title}
                            </h4>
                          </div>
                          <p className="text-sm" data-testid={`card-description-${card.id}`}>
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Timestamp */}
            <div className={`w-full mt-1 ${
              message.role === "user" ? "text-right pr-14" : "text-left pl-14"
            }`}>
              <p className="text-xs text-neutral">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="animate-fade-in" data-testid="typing-indicator">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neutral rounded-full animate-typing"></div>
                  <div className="w-2 h-2 bg-neutral rounded-full animate-typing" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-neutral rounded-full animate-typing" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
