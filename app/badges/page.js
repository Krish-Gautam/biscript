"use client";
import React from "react";
import Link from "next/link";
import { getBadges } from "../services/getBagdes";
import { useState, useEffect } from "react";


export default function BadgesPage() {

    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const fetchBadges = async () => {
            const { data, error } = await getBadges();
            if (error) {
                console.error("Error fetching badges:", error);
            }
            setBadges(data);
            console.log("Fetched badges:", data)
        };
        fetchBadges();
    }, []);

  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014] text-white font-sans p-6">
      <div className="w-full max-w-5xl mx-auto mt-8 bg-[#232526] border border-gray-700 rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">All Badges</h1>
          <Link href="/profile" className="text-blue-400 hover:underline font-medium text-base">Back to Profile</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center bg-gradient-to-br from-[#23272f] to-[#31343b] border border-white/10 rounded-xl p-6 shadow-lg transition-transform hover:scale-105 group relative animate-fade-in"
            >
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform drop-shadow-lg">{badge.icon}</span>
              <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1 text-center">{badge.name}</span>
              <span className="text-xs text-gray-400 text-center leading-relaxed">{badge.description}</span>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
