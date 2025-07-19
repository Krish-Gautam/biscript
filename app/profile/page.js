"use client";
import React, { use, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";

const page = () => {

  const [currentUser, setCurrentUser] = useState(null);
   
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/signin";
      }
      else{
        const user = session.user;
       setCurrentUser(user);
      }
    };
    checkUser();

  }, []);


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014] text-white font-sans">
        <div className="flex md:max-w-[1200px] lg:max-w-screen-xl mx-auto h-full py-8 gap-6 px-6">
          {/* Left Sidebar - Profile Info */}
          <div className="bg-[#18181b] w-full rounded-2xl max-w-[350px] flex flex-col gap-6 p-6 shadow-xl border border-white/10">
            {/* Profile Header */}
            <div className="flex gap-4 items-center">
              <div className="relative">
                <img 
                  height={80} 
                  width={80} 
                  src="profil.jpeg" 
                  alt="Profile" 
                  className="rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#18181b]"></div>
              </div>
              <div className="flex flex-col justify-center">
                {currentUser && (
                  <>
                  <div className="text-2xl font-bold text-white">krish</div>
                <div className="text-gray-400 text-sm">{currentUser.email}</div>
                  </>
                  )}
                <div className="text-green-400 text-xs font-medium mt-1">Online</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-xl cursor-pointer text-center font-semibold hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg">
              Edit Profile
            </div>

            {/* Divider */}
            <div className="bg-white/10 h-[1px] rounded-full"></div>

            {/* Stats Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#23272f] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-blue-400">127</div>
                  <div className="text-gray-400 text-sm">Problems Solved</div>
                </div>
                <div className="bg-[#23272f] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-green-400">15</div>
                  <div className="text-gray-400 text-sm">Streak Days</div>
                </div>
                <div className="bg-[#23272f] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-purple-400">8</div>
                  <div className="text-gray-400 text-sm">Languages</div>
                </div>
                <div className="bg-[#23272f] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-yellow-400">92%</div>
                  <div className="text-gray-400 text-sm">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-col w-full rounded-2xl max-w-[calc(100%-350px)] gap-6">
            {/* Top Row - Stats Cards */}
            <div className="flex h-[200px] w-full gap-6">
              {/* Problems Solved Card */}
              <div className="bg-[#18181b] w-full rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Problems Solved</h3>
                  <div className="text-3xl font-bold text-blue-400">127</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Easy</span>
                    <span className="text-green-400 font-medium">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Medium</span>
                    <span className="text-yellow-400 font-medium">52</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Hard</span>
                    <span className="text-red-400 font-medium">30</span>
                  </div>
                </div>
              </div>

              {/* Badges & Languages Card */}
              <div className="bg-[#18181b] w-full rounded-2xl p-6 border border-white/10 shadow-xl overflow-auto hide-scrollbar">
                <h3 className="text-lg font-semibold text-white mb-4">Badges & Languages</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">🏆</div>
                    <span className="text-sm text-gray-300">Problem Solver</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">🔥</div>
                    <span className="text-sm text-gray-300">Streak Master</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">⚡</div>
                    <span className="text-sm text-gray-300">Speed Coder</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Languages</div>
                  <div className="flex gap-2 flex-wrap">
                    {["JavaScript", "Python", "Java", "C++", "Go", "Rust", "Swift", "Kotlin"].map((lang, i) => (
                      <span key={i} className="bg-[#23272f] text-xs px-2 py-1 rounded-full text-gray-300">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-[#18181b] w-full h-full rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Leaderboard</h3>
                <div className="flex gap-2">
                  <button className="bg-[#23272f] cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#31343b] transition">Global</button>
                  <button className="bg-blue-600 cursor-pointer   px-4 py-2 rounded-lg text-sm font-medium">Friends</button>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Divy", score: 2847, avatar: "👑" },
                  { rank: 2, name: "Ashish", score: 2653, avatar: "🥈" },
                  { rank: 3, name: "Harry", score: 2489, avatar: "🥉" },
                  { rank: 4, name: "You", score: 2341, avatar: "👤" },
                  { rank: 5, name: "Rahul", score: 2198, avatar: "👤" },
                ].map((user, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${user.name === "You" ? "bg-blue-600/20 border border-blue-500/30" : "bg-[#23272f] hover:bg-[#31343b]"} transition`}>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">Rank #{user.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{user.score}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
