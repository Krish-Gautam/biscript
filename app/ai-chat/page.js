import React from "react";
import ChatBox from "./ChatBox";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0c] via-[#131516] to-[#0a0a0a] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">AI Chat</h1>
          <p className="text-gray-400 mt-1">A simple chat interface that talks to the Biscript AI (local Ollama backend).</p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
}
