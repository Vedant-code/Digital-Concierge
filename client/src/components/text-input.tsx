import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send } from "lucide-react";

interface TextInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function TextInput({ onSend, disabled }: TextInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (!disabled) {
      onSend(suggestion);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [message]);

  return (
    <div className="text-input" data-testid="text-input-container">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message here..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[56px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              data-testid="textarea-message"
            />
            
            {/* Quick Actions */}
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5 h-auto text-neutral hover:text-gray-900"
                disabled={disabled}
                data-testid="button-attach-file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5 h-auto text-neutral hover:text-gray-900"
                disabled={disabled}
                data-testid="button-emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Character Count */}
          <p className="text-xs text-neutral mt-2 text-right" data-testid="character-count">
            {message.length}/2000
          </p>
        </div>
        
        {/* Send Button */}
        <Button
          size="lg"
          className="bg-primary hover:bg-blue-700 text-white p-4 rounded-xl transition-all transform hover:scale-105 focus:ring-4 focus:ring-blue-200"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          data-testid="button-send-message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Suggested Responses */}
      <div className="flex flex-wrap gap-2 mt-4" data-testid="suggested-responses">
        {["Check-in time?", "WiFi password", "Restaurant reservations"].map((suggestion) => (
          <Button
            key={suggestion}
            variant="secondary"
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
            onClick={() => handleSuggestion(suggestion)}
            disabled={disabled}
            data-testid={`suggestion-${suggestion.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
