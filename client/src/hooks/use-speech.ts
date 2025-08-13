import { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/lib/speech-api";

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const { isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => {
      setTranscript(result.text);
    },
    onEnd: () => {
      setIsRecording(false);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    }
  });

  const startRecording = () => {
    if (isSupported && !isRecording) {
      setTranscript("");
      setIsRecording(true);
      startListening();
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      stopListening();
    }
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopListening();
      }
    };
  }, [isRecording, stopListening]);

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    isSupported
  };
}
