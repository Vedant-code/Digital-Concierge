import { useState } from "react";
import { Menu, Settings, Keyboard, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/message-list";
import { VoiceInput } from "@/components/voice-input";
import { TextInput } from "@/components/text-input";
import { useConversation } from "@/hooks/use-conversation";

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
}

export function ChatInterface({ onToggleSidebar }: ChatInterfaceProps) {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const { messages, sendMessage, isLoading, conversationId } = useConversation();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggleSidebar}
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-gray-900" data-testid="chat-title">
                Digital Concierge Chat
              </h2>
              <p className="text-sm text-neutral" data-testid="chat-subtitle">
                How can I help you today?
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Input Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1" data-testid="input-mode-toggle">
              <Button
                variant={inputMode === "text" ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1.5 text-sm font-medium ${
                  inputMode === "text" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-neutral hover:text-gray-900"
                }`}
                onClick={() => setInputMode("text")}
                data-testid="button-text-mode"
              >
                <Keyboard className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button
                variant={inputMode === "voice" ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1.5 text-sm font-medium ${
                  inputMode === "voice" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-neutral hover:text-gray-900"
                }`}
                onClick={() => setInputMode("voice")}
                data-testid="button-voice-mode"
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <MessageList 
        messages={messages} 
        isLoading={isLoading}
        data-testid="message-list"
      />
      
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {inputMode === "voice" ? (
            <VoiceInput
              onTranscript={sendMessage}
              disabled={isLoading}
              data-testid="voice-input"
            />
          ) : (
            <TextInput
              onSend={sendMessage}
              disabled={isLoading}
              data-testid="text-input"
            />
          )}
        </div>
      </div>
    </div>
  );
}
