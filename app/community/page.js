"use client";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-gray-400 mb-6">Join discussions, share solutions, and connect with other learners. Coming soon.</p>
          <div className="flex gap-3">
            <Link href="/docs" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition">Read Docs</Link>
            <Link href="/profile" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition">Go to Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


