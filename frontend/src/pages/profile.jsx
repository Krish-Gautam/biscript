"use client";
import React, { useEffect, useState, Suspense } from "react";
import {
  Edit,
  Trophy,
  Target,
  Award,
  TrendingUp,
  MapPin,
  User,
  Mail,
} from "lucide-react";
import { getBadges } from "../services/badgeServices";
import { getChallengeByUserId } from "../services/challengesServices";
import { getProfile } from "../services/profileServices";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProfileSkeleton } from "../components/LoadingSkeleton";
import profile from "../assets/profile.jpg";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    location: "",
    avatar_url: "",
  });
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await getProfile(userId);
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setEditForm({
          username: data.username || "User",
          bio: data.bio || "No bio available",
          location: data.location || "Location not set",
          avatar_url: data.avatar_url || "/profile.jpg",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (loading) return; // wait until auth resolves

    const handleUser = async () => {
      try {
        if (!user) {
          navigate("/auth/register");
          return;
        }

        setCurrentUser(user);
        await fetchUserProfile(user._id);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    handleUser();
  }, [user, loading, navigate, fetchUserProfile]);

  useEffect(() => {
  if (currentUser?._id) {
    const fetchchallenge = async () => {
      try {
        const res = await getChallengeByUserId(currentUser._id);

        setChallenges(res.data || []);
      } catch (err) {
        console.error("Error fetching challenges:", err); // ✅ real error
      }
    };

    fetchchallenge();
  }
}, [currentUser?._id]);

  const handleEditSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your database
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    fetchUserProfile(currentUser._id);
  };

  const stats = {
    problemsSolved: 127,
    badgesEarned: 8,
    challengesWon: 15,
    overallRanking: 4,
    accuracy: 92,
    streakDays: 15,
    languages: 8,
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br pt-12 from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white font-sans">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
                {/* Background decoration - subtle */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-[60px]"></div>

                {/* Profile Header */}
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    {/* Profile Image */}
                    <div className="relative mb-6 w-32 h-32 rounded-full overflow-hidden border border-white/10 shadow-lg bg-[#202023] flex items-center justify-center">
                      <img
                        src={
                          editForm.avatar_url &&
                          editForm.avatar_url.startsWith("http")
                            ? editForm.avatar_url
                            : profile
                        }
                        alt="Profile"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* User Info */}
                    {currentUser && (
                      <div className="space-y-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                username: e.target.value,
                              })
                            }
                            className="text-2xl font-semibold text-white bg-[#202023] border border-white/10 rounded-lg px-3 py-2 text-center w-full focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                          />
                        ) : (
                          <div className="text-2xl font-semibold tracking-tight text-white">
                            {editForm.username}
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>{currentUser.email}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Action */}
                  <div className="mb-8">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleEditSave}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white p-3 rounded-xl font-medium transition-all duration-150 shadow-sm"
                        >
                          <Edit size={16} />
                          <span className="ml-2">Save Changes</span>
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex-1 bg-[#202023] hover:bg-[#2a2a2d] text-white p-3 rounded-xl font-medium border border-white/10 transition-all duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <Link
                        to="/profile/edit"
                        className="w-full inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white p-3 rounded-xl font-medium border border-white/10 transition-all duration-150"
                      >
                        <Edit size={16} />
                        <span className="ml-2">Edit Profile</span>
                      </Link>
                    )}
                  </div>

                  {/* About */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      About
                    </h4>
                    {!editForm.bio ? (
                      <div className="animate-pulse bg-[#202023] rounded-lg h-16 border border-white/10" />
                    ) : (
                      <div className="bg-[#202023] rounded-lg p-4 border border-white/10">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {editForm.bio}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300 text-sm bg-[#202023] rounded-lg p-3 border border-white/10">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{editForm.location}</span>
                    </div>
                  </div>
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
                    <span className="text-2xl font-bold text-blue-400">0</span>
                  </div>
                  <div className="text-gray-400 text-sm">Problems Solved</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">
                      {badges.length}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">Badges Earned</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-6 h-6 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">
                      {challenges.length}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">Challenges Won</div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <span className="text-2xl font-bold text-purple-400">
                      #1
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">Overall Ranking</div>
                </div>
              </div>

              {/* Badges Section */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Badges Earned
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.length > 0 &&
                    badges.map((badge, index) => (
                      <div
                        key={index}
                        className="bg-[#2a2a2d]/80 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:scale-105 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg`}
                          >
                            {badge.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {badge.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {badge.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {badges && badges.length === 0 && (
                  <div className="text-center text-gray-400 text-sm mt-4">
                    No badges earned yet. Here are all badges you can earn!
                    <Link to="/badges">
                      <span className="text-blue-400 hover:underline">
                        {" "}
                        View All Badges
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Challenges Won Section */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Challenges Won
                  </h3>
                </div>
                <div className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="bg-[#2a2a2d]/80 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-white">
                              {challenge.title}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {challenge.date} • {challenge.participants}{" "}
                              participants
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            Score: {challenge.score}
                          </div>
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

export default Profile;
