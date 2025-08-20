"use client";
import React, { useEffect, useState } from "react";
import Navbar2 from "../components/Navbar2";
import { supabase } from "../utils/supabaseClient";
import { Edit, Trophy, Target, Award, TrendingUp, MapPin, User, Mail } from "lucide-react";
import { getUserChallenges } from "../services/getUserChallenges";

const page = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "krish",
    bio: "Passionate coder who loves solving complex problems and learning new technologies.",
    location: "Mumbai, India"
  });
  const [challenges, setChallenges] = useState([])

  

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/signin";
      } else {
        const user = session.user;
        setCurrentUser(user);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
  if (currentUser?.id) {   // only runs when currentUser is set
    const fetchchallenge = async () => {
      console.log('userid', currentUser.id)
      const { data, error } = await getUserChallenges(currentUser.id);
      if (error) {
        console.error("Error fetching user challenges:", error);
      }
      setChallenges(data);
      console.log("Fetched user challenges:", data);
    }
    fetchchallenge();
  }
}, [currentUser?.id])


  const handleEditSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your database
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({
      username: "krish",
      bio: "Passionate coder who loves solving complex problems and learning new technologies.",
      location: "Mumbai, India"
    });
  };

  const stats = {
    problemsSolved: 127,
    badgesEarned: 8,
    challengesWon: 15,
    overallRanking: 4,
    accuracy: 92,
    streakDays: 15,
    languages: 8
  };

  const badges = [
    { name: "Problem Solver", icon: "🏆", color: "bg-yellow-500", description: "Solved 100+ problems" },
    { name: "Streak Master", icon: "🔥", color: "bg-orange-500", description: "15 day streak" },
    { name: "Speed Coder", icon: "⚡", color: "bg-blue-500", description: "Fastest solution" },
    { name: "Accuracy King", icon: "🎯", color: "bg-green-500", description: "95%+ accuracy" },
    { name: "Language Master", icon: "🌐", color: "bg-purple-500", description: "8 languages" },
    { name: "Challenge Champion", icon: "👑", color: "bg-pink-500", description: "15 challenges won" },
    { name: "Early Bird", icon: "🐦", color: "bg-indigo-500", description: "First to solve" },
    { name: "Consistency", icon: "⭐", color: "bg-teal-500", description: "30 days active" }
  ];

  // const challenges = [
  //   { name: "Weekly Coding Challenge", date: "2024-01-15", rank: 1, participants: 150 },
  //   { name: "Algorithm Master", date: "2024-01-08", rank: 2, participants: 89 },
  //   { name: "Data Structures", date: "2024-01-01", rank: 1, participants: 234 },
  //   { name: "Dynamic Programming", date: "2023-12-25", rank: 3, participants: 67 },
  //   { name: "System Design", date: "2023-12-18", rank: 1, participants: 45 }
  // ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white font-sans">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                
                {/* Profile Header */}
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <div className="relative">
                        <img 
                          height={140} 
                          width={140} 
                          src="profil.jpeg" 
                          alt="Profile" 
                          className="rounded-3xl object-cover shadow-2xl border-4 border-white/20 ring-4 ring-blue-500/30"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-[#1a1a1d] flex items-center justify-center shadow-lg">
                          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    {currentUser && (
                      <div className="space-y-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                            className="text-3xl font-bold text-white bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-2 text-center w-full backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {editForm.username}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>{currentUser.email}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Profile Button */}
                  <div className="mb-8">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleEditSave}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl font-semibold hover:from-green-400 hover:to-green-500 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 hover:shadow-green-500/25 hover:scale-105"
                        >
                          <Edit size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex-1 bg-[#2a2a2d]/80 text-white p-4 rounded-2xl font-semibold hover:bg-[#3a3a3d] transition-all duration-200 border border-white/10 flex items-center justify-center backdrop-blur-sm hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl font-semibold hover:from-blue-400 hover:to-purple-500 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 hover:shadow-blue-500/25 hover:scale-105"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Bio Section */}
                  {isEditing ? (
                    <div className="space-y-3 mb-6">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Bio
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        className="w-full bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm resize-none backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="bg-[#2a2a2d]/60 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <p className="text-gray-300 text-sm leading-relaxed">{editForm.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        placeholder="Enter your location..."
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#2a2a2d]/60 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{editForm.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Achievements */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-6 h-6 text-blue-400" />
                    <span className="text-2xl font-bold text-blue-400">{stats.problemsSolved}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Problems Solved</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">{stats.badgesEarned}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Badges Earned</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-6 h-6 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">{stats.challengesWon}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Challenges Won</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <span className="text-2xl font-bold text-purple-400">#{stats.overallRanking}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Overall Ranking</div>
                </div>
              </div>

              {/* Badges Section */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Badges Earned</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="bg-[#2a2a2d]/80 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:scale-105 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 ${badge.color} rounded-full flex items-center justify-center text-lg shadow-lg`}>
                          {badge.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{badge.name}</div>
                          <div className="text-gray-400 text-xs">{badge.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges Won Section */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Challenges Won</h3>
                </div>
                <div className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <div key={index} className="bg-[#2a2a2d]/80 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:scale-105 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                            challenge.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                            challenge.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                            challenge.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                          }`}>
                            {challenge.rank === 1 ? '🥇' : challenge.rank === 2 ? '🥈' : challenge.rank === 3 ? '🥉' : challenge.rank}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{challenge.title}</div>
                            <div className="text-gray-400 text-sm">{challenge.date} • {challenge.participants} participants</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">Rank #{challenge.rank}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
