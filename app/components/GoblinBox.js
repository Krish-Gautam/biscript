import React, { useEffect, useState } from "react";

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
    }, 40);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <div className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-[#232526] border border-gray-700/40 shadow-lg animate-fade-in">
      <div className="text-gray-400 font-bold text-sm">👹 Goblin <span className="capitalize"></span></div>

      <div className="flex-1 min-h-[48px] text-gray-200 font-mono text-lg whitespace-pre-wrap">
        <span>{animatedText}</span>
        <span className="animate-blink">|</span>
      </div>
    </div>
  );
}

