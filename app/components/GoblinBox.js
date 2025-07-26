import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function GoblinBox({ lines }) {
  const [animatedText, setAnimatedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (!lines || !lines[currentIdx]) return;
    const fullLine = lines[currentIdx].content_text || "";
    setAnimatedText("");
    setTypingIndex(0);

    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        const nextIndex = prev + 1;
        setAnimatedText(fullLine.slice(0, nextIndex));
        if (nextIndex >= fullLine.length) {
          clearInterval(interval);
        }
        return nextIndex;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [currentIdx, lines]);

  const handleNextLine = () => {
    if (currentIdx < lines.length) {
      setCurrentIdx(currentIdx + 1)
      
    }
  }
  return (
    <div className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-[#232526] border border-gray-700/40 shadow-lg animate-fade-in">
      <div className=" text-gray-400 font-bold text-sm">📜 Goblin Script</div>

      <div className="flex-1 min-h-[48px] text-gray-200 font-mono text-lg">
        <span className="text-gray-500 mr-2">{lines[currentIdx].line_number}.</span>
        <span>{animatedText}</span>
        <span className="animate-blink">|</span>
      </div>

      <div className="bg-gray-700 p-2 display inline rounded-sm">
        {currentIdx >= lines.length - 1 ? (
          <div className="cursor-pointer text-green-400">Done!</div>
        ) : (
          <div className="bg-gray-700 p-2 display inline rounded-sm">
            <button className="cursor-pointer" onClick={handleNextLine}>Next</button>
          </div>
        )}

      </div>
    </div>
  );
}
