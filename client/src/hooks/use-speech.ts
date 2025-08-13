import { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/lib/speech-api";

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [shouldSendOnEnd, setShouldSendOnEnd] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef<((text: string) => void) | null>(null);

  const { isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => {
      console.log('Speech result:', result);
      const text = result.text.trim();
      setTranscript(text);
      // If we get any result with text, prepare to send it
      if (text) {
        setShouldSendOnEnd(true);
        console.log('Setting shouldSend to true for text:', text);
      }
    },
    onEnd: () => {
      console.log('Speech recognition ended, shouldSend:', shouldSendOnEnd, 'transcript:', transcript);
      setIsRecording(false);
      // Auto-send if we have a transcript and should send
      setTimeout(() => {
        if ((shouldSendOnEnd || transcript.trim()) && onTranscriptRef.current) {
          const finalTranscript = transcript.trim();
          if (finalTranscript) {
            console.log('Auto-sending transcript on end:', finalTranscript);
            onTranscriptRef.current(finalTranscript);
            setTranscript("");
            setShouldSendOnEnd(false);
          }
        }
      }, 50);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
      setTranscript("");
      setShouldSendOnEnd(false);
    }
  });

  const startRecording = (onTranscript?: (text: string) => void) => {
    if (isSupported && !isRecording) {
      setTranscript("");
      setShouldSendOnEnd(false);
      onTranscriptRef.current = onTranscript || null;
      setIsRecording(true);
      startListening();
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setShouldSendOnEnd(true); // Ensure we send when manually stopped
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
