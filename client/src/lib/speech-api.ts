import { useCallback, useRef } from "react";
import { type VoiceTranscript } from "@shared/schema";

interface SpeechRecognitionOptions {
  onResult: (result: VoiceTranscript) => void;
  onEnd: () => void;
  onError: (error: any) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export function useSpeechRecognition({
  onResult,
  onEnd,
  onError,
  continuous = false,
  interimResults = true,
  language = "en-US"
}: SpeechRecognitionOptions) {
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== "undefined" && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }

        onResult({
          text: finalTranscript || interimTranscript,
          confidence: confidence || 0,
          isFinal: event.results[i].isFinal
        });
      }
    };

    recognition.onend = onEnd;
    recognition.onerror = onError;

    recognition.start();
    recognitionRef.current = recognition;
  }, [continuous, interimResults, language, onResult, onEnd, onError, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return {
    startListening,
    stopListening,
    isSupported
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
