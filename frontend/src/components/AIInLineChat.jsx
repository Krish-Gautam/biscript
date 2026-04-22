"use client";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AIInlineChat({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false); // ✅ FIXED
  const [userId, setUserId] = useState(null);

  const bottomRef = useRef(null);

  // ✅ ONLY auth loading here
  const { user, loading } = useAuth();

  // ✅ Get userId correctly (NO guessing)
  useEffect(() => {
  if (loading) return;

  if (!user) {
    console.warn("⚠️ No active session found.");
    return;
  }

  console.log("USER OBJECT:", user);

  const id = user?._id;

  if (!id) {
    console.error("❌ User ID not found");
    return;
  }
  setUserId(id);
}, [user, loading]);

  // ✅ Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // ✅ Send message
  const sendMessage = async (e) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text) return;

    if (!userId) {
      console.error("❌ Cannot send message: userId missing");
      return;
    }

    const userMsg = { id: Date.now() + "-u", role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await axios.post("/api/ai", {
        userId,
        message: text,
      });

      const aiText = res.data?.reply || "Sorry, no reply.";
      const aiMsg = { id: Date.now() + "-a", role: "ai", text: aiText };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI request error:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-err",
          role: "ai",
          text: "Error: could not reach AI.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => setMessages([]);
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d] border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
      {/* Header (matches sidebar header) */}
      <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-sm text-white">
            🤖
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Biscript AI</div>
            <div className="text-xs text-gray-400">
              Ask about lessons or coding
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-xs px-2 py-1 cursor-pointer bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 cursor-pointer bg-transparent hover:bg-gray-700 rounded text-white"
          >
            Close
          </button>
        </div>
      </div>

      {/* Messages area styled like sidebar list (professional bubbles) */}
      <div className="flex-1 overflow-auto p-3 hide-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-6">
            Chat with Biscript — quick, concise help for your code.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`w-full flex items-start mb-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              } min-w-0`}
            >
              {/* AI Avatar */}
              {m.role === "ai" && (
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-sm shadow-sm">
                    🤖
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div className="px-4 py-3 rounded-2xl shadow-sm text-sm break-words whitespace-pre-wrap max-w-[80%] min-w-0 bg-[#232526] text-gray-200 border border-gray-700">
                {m.text}
              </div>

              {/* User Avatar */}
              {m.role === "user" && (
                <div className="flex-shrink-0 ml-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-sm shadow-sm">
                    You
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="w-full flex justify-end">
              <div className="max-w-[60%] px-4 py-3 rounded-2xl bg-[#232526] text-gray-200 shadow-sm">
                Typing <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Footer input (matches sidebar footer style) */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-gray-700 bg-gradient-to-r from-[#2a2a2d] to-[#232526] flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-10 bg-[#232526] border border-gray-600 text-white rounded px-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Ask Biscript..."
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-3 bg-[#222222] cursor-pointer text-[#28c244] rounded hover:bg-gray-700 transition"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
