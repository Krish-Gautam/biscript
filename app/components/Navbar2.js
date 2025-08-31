 "use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, RotateCcw, Copy, Download, ChevronDown, Check, Menu } from "lucide-react";

export default function Navbar2({
  title,
  difficulty,
  onRun,
  onSubmit,
  onReset,
  onCopy,
  onDownload,
  languageOptions = [
    { name: "JavaScript" },
    { name: "Python" },
    { name: "C++" },
    { name: "Java" },
  ],
  currentLanguage,
  onLanguageChange,
  isRunning = false,
  isSubmitting = false,
  hamburgerToggle,
  rightSlot,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyTimer, setCopyTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (copyTimer) clearTimeout(copyTimer);
    };
  }, [copyTimer]);

  return (
    <nav className="h-14 w-full bg-gradient-to-r from-[#1a1a1d] to-[#2a2a2d] border-b border-gray-700 shadow-lg">
      <style>{`
          @media (max-width: 768px) {
            .hidden-md {
              display: none
            }
          }
          .display-md{
            display: none;
          }
          @media (max-width: 768px) {
            .display-md {
              display: block;
            }
          }
        `}</style>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-neutral-800/80 rounded-lg flex items-center justify-center shadow-lg select-none">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
          </Link>
          {/* <div className="truncate">
            <div className="text-sm text-white truncate max-w-[40vw]">
              {title || "Editor"}
            </div>
            {difficulty && (
              <span className="text-[11px] text-gray-400">{difficulty}</span>
            )}
          </div> */}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-[#232526] hover:bg-[#2e2f31] text-gray-200 rounded-md border border-gray-700 ${langOpen ? "ring-1 ring-gray-600" : ""}`}
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
            >
              <span className="text-sm">
                {currentLanguage || languageOptions?.[0]?.name || "Language"}
              </span>
              <ChevronDown size={14} className={`${langOpen ? "rotate-180" : ""} transition-transform duration-200`} />
            </button>
            <div
              className={`absolute z-50 mt-2 w-40 bg-[#252526] border border-gray-700 rounded-md shadow-xl origin-top transition duration-200 ease-out ${
                langOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
            >
              {languageOptions.map((l) => (
                <button
                  key={l.name}
                  onClick={() => {
                    setLangOpen(false);
                    onLanguageChange && onLanguageChange(l.name);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 ${
                    currentLanguage === l.name ? "text-white" : "text-gray-300"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button
            onClick={async () => {
              if (copied) return;
              if (onCopy) await onCopy();
              setCopied(true);
              const t = setTimeout(() => setCopied(false), 2000);
              setCopyTimer(t);
            }}
            disabled={copied}
            className={`cursor-pointer hidden-md px-3 py-1.5 rounded-md border ${
              copied
                ? "bg-green-600/20 text-green-400 border-green-700"
                : "bg-[#232526] hover:bg-[#2e2f31] text-gray-200 border-gray-700"
            }`}
            title={copied ? "Copied" : "Copy code"}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={onDownload}
            className="cursor-pointer hidden-md px-3 py-1.5 bg-[#232526] hover:bg-[#2e2f31] text-gray-200 rounded-md border border-gray-700"
            title="Download code"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onReset}
            className="cursor-pointer hidden-md px-3 py-1.5 bg-[#232526] hover:bg-[#2e2f31] text-gray-200 rounded-md border border-gray-700"
            title="Reset code"
          >
            <RotateCcw size={16} />
          </button>

          <div className="w-px hidden-md h-6 bg-gray-700 mx-1" />

          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-md shadow border border-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-1.5 hidden-md bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-white rounded-md shadow border border-green-700"
          >
            <div className="select-none hidden-md flex items-center gap-2">
              <Play size={16} />
              <span>{isRunning ? "Running..." : "Run"}</span>
            </div>
          </button>
          <button
            onClick={hamburgerToggle}
            className="cursor-pointer display-md px-3 py-1.5 bg-[#232526] hover:bg-[#2e2f31] text-gray-200 rounded-md border border-gray-700"
          >
            <Menu size={20} />
          </button>

          {rightSlot}
        </div>
      </div>
    </nav>
  );
}

