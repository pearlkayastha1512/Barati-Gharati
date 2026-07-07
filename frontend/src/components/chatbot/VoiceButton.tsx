


"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

import { useChatbotStore } from "@/store/chatbotStore";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceButtonProps {
  value: string;
  onChange: (text: string) => void;
}

export default function VoiceButton({
  value,
  onChange,
}: VoiceButtonProps) {
  const {
    isListening,
    setListening,
  } = useChatbotStore();

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      onChange(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onChange, setListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleListening}
      className={`
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        transition-all
        duration-300
        ${
          isListening
            ? "bg-red-500 text-white shadow-lg"
            : "bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600"
        }
      `}
    >
      <AnimatePresence>
        {isListening && (
          <motion.span
            initial={{
              scale: 1,
              opacity: 0.5,
            }}
            animate={{
              scale: 2,
              opacity: 0,
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
            className="
              absolute
              inset-0
              rounded-xl
              bg-red-400
            "
          />
        )}
      </AnimatePresence>

      {isListening ? (
        <MicOff
          size={18}
          className="relative z-10"
        />
      ) : (
        <Mic
          size={18}
          className="relative z-10"
        />
      )}
    </motion.button>
  );
}