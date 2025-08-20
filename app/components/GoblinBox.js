import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For smooth fade/scale animations

export default function GoblinBox({ response = "" }) {
  const [animatedText, setAnimatedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    if (!response) return;

    setAnimatedText("");
    setTypingIndex(0);

    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        const next = prev + 1;
        setAnimatedText(response.slice(0, next));
        if (next >= response.length) clearInterval(interval);
        return next;
      });
    }, 60); // slightly faster typing speed

    return () => clearInterval(interval);
  }, [response]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-gray-700/40 shadow-lg bg-gradient-to-br from-[#1b1c1d] to-[#232526] relative overflow-hidden"
    >
      {/* Decorative glow effect */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-green-400/10 shadow-[0_0_25px_rgba(34,197,94,0.15)]"></div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
          className="text-green-400 text-lg"
        >
          👹
        </motion.span>
        <span className="font-bold text-sm text-green-400 tracking-wide bg-green-400/10 px-2 py-1 rounded-lg">
          Goblin
        </span>
      </div>

      {/* Text output */}
      <div className="flex-1 min-h-[48px] text-gray-100 font-mono text-lg whitespace-pre-wrap leading-relaxed">
        <span>{animatedText}</span>
        <span className="animate-blink text-green-400">|</span>
      </div>

      {/* Cursor blink animation */}
      <style jsx>{`
        .animate-blink {
          animation: blink 2s infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
