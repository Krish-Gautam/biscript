"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { updateProfile, getProfile } from "../../services/updateProfile";
import { ArrowLeft, User, MapPin, Camera, Save, X, Check } from "lucide-react";
import Navbar from "../../components/Navbar";

const EditProfile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    avatar_url: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
        return;
      }

      setCurrentUser(session.user);
      await fetchProfile(session.user.id);
    };

    checkUser();
  }, [router]);

  const fetchProfile = async (userId) => {
    try {
      console.log('id', userId)
      const { data, error } = await getProfile(userId);
      if (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: 'error', text: 'Failed to load profile' });
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          location: data.location || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await updateProfile({
        userId: currentUser.id,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url
      });

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        return;
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      

    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white font-sans">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleCancel}
              className="p-2 rounded-xl bg-[#1a1a1d] border border-white/10 hover:bg-[#2a2a2d] transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-gray-400">Update your profile information</p>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                {message.text}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Avatar and Basic Info */}
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="select-none bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="relative">
                      <img
                        height={160}
                        width={160}
                        src={formData.avatar_url || "/profil.jpg"}  // fallback avatar
                        alt="Profile"
                        className="rounded-3xl object-cover shadow-2xl border-4 border-white/20 ring-4 ring-blue-500/30"
                      />

                      {/* Upload Button */}
                      <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-[#1a1a1d] flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer">
                        <Camera size={20} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            // unique filename
                            const filePath = `avatars/${currentUser.id}-${Date.now()}.${file.name.split(".").pop()}`;

                            // upload to Supabase
                            const { data, error } = await supabase.storage
                              .from("avatars")
                              .upload(filePath, file, { upsert: true });

                            if (error) {
                              console.error("Upload error:", error);
                              setMessage({ type: "error", text: "Failed to upload image" });
                              return;
                            }

                            // get public URL
                            const { data: publicUrl } = supabase.storage
                              .from("avatars")
                              .getPublicUrl(filePath);

                            // update formData
                            setFormData((prev) => ({
                              ...prev,
                              avatar_url: publicUrl.publicUrl,
                            }));
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>


              {/* Email Display */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-white font-medium">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              {/* Username */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-6 border border-white/10 shadow-xl">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-400" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-medium backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Enter your username"
                />
                <p className="text-xs text-gray-500 mt-2">This will be displayed to other users</p>
              </div>

              {/* Bio */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-6 border border-white/10 shadow-xl">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-green-400" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm resize-none backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-2">Share your interests, skills, or what you're passionate about</p>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] rounded-3xl p-6 border border-white/10 shadow-xl mb-6">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2d]/80 border border-white/20 rounded-xl px-4 py-3 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Enter your location"
                />
                <p className="text-xs text-gray-500 mt-2">City, Country or any location you'd like to share</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={handleCancel}
              className="px-8 py-4 bg-[#2a2a2d]/80 text-white rounded-2xl font-semibold hover:bg-[#3a3a3d] transition-all duration-200 border border-white/10 backdrop-blur-sm hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
