import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const { 
    isRecording, 
    transcript, 
    startRecording, 
    stopRecording, 
    isSupported 
  } = useSpeech();

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center py-8" data-testid="voice-not-supported">
        <i className="fas fa-microphone-slash text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">Voice input is not supported in your browser</p>
      </div>
    );
  }

  return (
    <div className="voice-input" data-testid="voice-input-container">
      <div className="flex items-center justify-center space-x-4 py-8">
        {/* Voice Button with Animation */}
        <div className="relative">
          <Button
            size="lg"
            className={`w-20 h-20 rounded-full transition-all transform hover:scale-105 focus:ring-4 focus:ring-green-200 ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-accent hover:bg-green-600"
            }`}
            onClick={handleToggleRecording}
            disabled={disabled}
            data-testid="button-voice-record"
          >
            {isRecording ? (
              <i className="fas fa-stop text-white text-2xl"></i>
            ) : (
              <i className="fas fa-microphone text-white text-2xl"></i>
            )}
          </Button>
          
          {/* Voice Wave Animation */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-accent animate-pulse-slow"></div>
              <div className="absolute -inset-2 rounded-full border-2 border-accent opacity-50 animate-pulse-slow" style={{ animationDelay: "0.5s" }}></div>
            </>
          )}
        </div>
        
        {/* Voice Feedback */}
        <div className="text-center">
          <p className={`font-medium ${isRecording ? "text-accent animate-pulse" : "text-gray-900"}`} data-testid="voice-status">
            {isRecording ? "Listening..." : "Tap to speak"}
          </p>
          {transcript && (
            <p className="text-sm text-neutral mt-1 max-w-md" data-testid="voice-transcript">
              {transcript}
            </p>
          )}
        </div>
      </div>
      
      {/* Voice Visualizer */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-1 mb-4" data-testid="voice-visualizer">
          {[20, 30, 25, 40, 35, 30, 45, 25].map((height, index) => (
            <div
              key={index}
              className="w-1 bg-accent rounded-full animate-wave"
              style={{ 
                height: `${height}px`, 
                animationDelay: `${index * 0.1}s` 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
