"use client";

import { supabase } from "@/app/utils/supabaseClient";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const bottomRef = useRef(null);

  // 🔹 Fetch the logged-in user ID from Supabase
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error("Session fetch error:", error);
      if (session?.user) {
        console.log("User ID:", session.user.id);
        setUserId(session.user.id);
      } else {
        console.warn("⚠️ No active session found. User must log in.");
      }
    };
    fetchUserId();
  }, []);

  // 🔹 Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Send message to AI route
  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !userId) return; // Block if not logged in or empty input

    const userMsg = { id: Date.now() + "-u", role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai", {
        userId, // ✅ match your route key
        message: text,
      });

      const aiText = res.data?.reply || "Sorry, no reply.";
      const aiMsg = { id: Date.now() + "-a", role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI request error:", err);
      const errMsg = {
        id: Date.now() + "-err",
        role: "ai",
        text: "Error: could not reach AI.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-[#232526] border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-[#2a2a2d] to-[#323334] border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Biscript AI Chat</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded shadow text-white transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 h-[60vh] md:h-[66vh] overflow-auto space-y-4 bg-[#18181b]">
          {messages.length === 0 && (
            <div className="text-center text-gray-400">
              Ask me anything about coding or lessons — {`I'll`} keep it short and funny.
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  m.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "bg-[#2a2a2d] text-gray-200"
                } max-w-[80%] p-3 rounded-xl shadow-sm`}
              >
                <div className="whitespace-pre-wrap text-sm">{m.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#2a2a2d] text-gray-200 max-w-[80%] p-3 rounded-xl shadow-sm">
                <div className="text-sm opacity-80">
                  Typing<span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-gray-700 bg-gradient-to-b from-[#18181b] to-[#0f0f10] flex gap-3 items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-12 bg-[#0f1011] border border-gray-700 text-white rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              userId ? "Type your question..." : "Login required to chat"
            }
            disabled={!userId || loading}
          />
          <button
            type="submit"
            disabled={loading || !userId}
            className="h-12 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 disabled:opacity-50 text-white rounded-lg transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
