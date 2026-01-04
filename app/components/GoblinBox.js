import React, { useEffect, useState } from "react";
export default function GoblinBox({
  response = "",
  isLessonStarted,
  canGoPrev,
  canGoNext,
  onStart,
  onPrev,
  onNext,
  className = "",
}) {
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    if (!response) return;

    let i = 0;
    setAnimatedText("");

    const interval = setInterval(() => {
      i++;
      setAnimatedText(response.slice(0, i));
      if (i >= response.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <div className=" fixed bg-[#1a1a1d] z-40 max-w-[400px] w-[300px] text-white p-[5px] rounded-xl border  overflow-visible border-gray-700 shadow-md cursor-pointer select-none">
      <div
        className={`relative p-3 rounded-lg flex flex-col gap-3
        border border-gray-700/40 shadow-lg
        bg-gradient-to-br from-[#1b1c1d] to-[#232526]
        ${className}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
            Miko
          </span>
        </div>

        {/* Message */}
        <div className="min-h-[48px] text-gray-100 font-mono whitespace-pre-wrap">
          <span>{animatedText}</span>
          <span className="animate-blink text-green-400">|</span>
        </div>

        {/* Controls */}
        {isLessonStarted && (
          <div className="flex justify-between items-center text-xs font-mono pt-1">
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className={`
            group flex items-center gap-1
            text-gray-400
            transition-all duration-200
            hover:text-green-400
            disabled:opacity-30 disabled:cursor-not-allowed
            cursor-pointer
          `}>
              <span className="tracking-wide">⟵ back</span>
            </button>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`
        group flex items-center gap-1
        text-gray-400
        transition-all duration-200
        hover:text-green-400
        disabled:opacity-30 disabled:cursor-not-allowed
        cursor-pointer
      `}
            >
              <span className="tracking-wide">continue ⟶</span>
            </button>
          </div>
        )}
      </div>
      {!isLessonStarted && (
        <div className="flex justify-center px-2 pb-1">
          <button
            onClick={() => onStart()}
            className="group flex items-center gap-2 text-sm font-mono text-green-400 transition-all duration-200 hover:text-green-300 cursor-pointer">
            <span className="">start lesson →</span>
          </button>
        </div>)}

    </div>
  );
}
