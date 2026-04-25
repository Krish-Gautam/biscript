"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, getProfile } from "../services/profileServices";
import { ArrowLeft, Camera, Save, X, Check, Mail, AtSign, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import profile from "../assets/profile.jpg";

const EditProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarHovered, setAvatarHovered] = useState(false);
  const { user, loading } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({ username: "", bio: "", avatar_url: "" });

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await getProfile(userId);
      if (error) { console.error("Error fetching profile:", error); return; }
      if (data) {
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "/profile.jpg",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (loading) return;
    const handleUser = async () => {
      try {
        if (!user) { navigate("/auth/register"); return; }
        setCurrentUser(user);
        await fetchUserProfile(user._id);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    handleUser();
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await fetch(`${API_BASE_URL}/api/upload`, { method: "POST", body: fd });
    const data = await res.json();
    setFormData((prev) => ({ ...prev, avatar_url: data.url }));
  };

  const handleSave = async () => {
    if (!currentUser?._id) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await updateProfile(currentUser._id, {
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
      });
      setMessage({ type: "success", text: res.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/profile");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/70 animate-spin" />
        <p className="text-sm text-[#555]">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8e8e8] p-6 sm:p-8">
      <div className="max-w-[820px] mx-auto py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="w-[38px] h-[38px] shrink-0 rounded-[10px] border border-white/[0.08] bg-[#161616] text-[#e8e8e8] flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[#222] hover:border-white/[0.15]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#e8e8e8] m-0">Edit Profile</h1>
            <p className="text-[13px] text-[#888] mt-[3px] mb-0">Manage your personal information</p>
          </div>
        </div>

        {/* Notification */}
        {message.text && (
          <div className={`flex items-center gap-[10px] text-[13.5px] px-4 py-[13px] rounded-[9px] mb-6 border ${
            message.type === "success"
              ? "bg-[rgba(74,222,128,0.07)] border-[rgba(74,222,128,0.25)] text-[#4ade80]"
              : "bg-[rgba(248,113,113,0.07)] border-[rgba(248,113,113,0.25)] text-[#f87171]"
          }`}>
            <span className="flex items-center">
              {message.type === "success" ? <Check size={15} /> : <X size={15} />}
            </span>
            {message.text}
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Left panel */}
          <div className="flex flex-col gap-3 w-full lg:w-[260px] shrink-0">

            {/* Avatar card */}
            <div className="bg-[#161616] border border-white/[0.08] rounded-[14px] p-6 flex flex-col items-center gap-3">
              <div
                className="relative w-[100px] h-[100px] rounded-full overflow-hidden cursor-pointer shrink-0"
                onMouseEnter={() => setAvatarHovered(true)}
                onMouseLeave={() => setAvatarHovered(false)}
              >
                <img
                  src={formData.avatar_url?.startsWith("http") ? formData.avatar_url : profile}
                  alt="Avatar"
                  className="w-full h-full object-cover block"
                />
                <label
                  className="absolute inset-0 bg-black/[0.62] flex flex-col items-center justify-center gap-[5px] cursor-pointer transition-opacity duration-200"
                  style={{ opacity: avatarHovered ? 1 : 0 }}
                >
                  <Camera size={22} color="#fff" />
                  <span className="text-[11px] text-white/[0.85] font-medium">Change photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="text-[11.5px] text-[#555] m-0">JPG, PNG · Max 5 MB</p>
            </div>

            {/* Email card */}
            <div className="bg-[#161616] border border-white/[0.08] rounded-[14px] px-4 py-[14px] flex items-center gap-3">
              <div className="w-8 h-8 shrink-0 rounded-[8px] bg-white/[0.05] flex items-center justify-center text-[#888]">
                <Mail size={15} />
              </div>
              <div>
                <p className="text-[11px] text-[#555] uppercase tracking-[0.05em] m-0 mb-[2px]">Email address</p>
                <p className="text-[13.5px] text-[#e8e8e8] m-0 break-all">{currentUser?.email}</p>
              </div>
            </div>

            {/* Buttons — desktop only */}
            <div className="hidden lg:flex gap-[10px]">
              <ActionButtons saving={saving} onCancel={handleCancel} onSave={handleSave} />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
            <FieldCard icon={<AtSign size={15} />} label="Username" hint="Visible to other users on the platform">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g. john_doe"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-[14px] py-[11px] text-[14.5px] text-[#e8e8e8] outline-none font-[inherit] transition-colors duration-150 focus:border-white/[0.22] focus:bg-white/[0.07] placeholder:text-white/[0.18]"
              />
            </FieldCard>

            <FieldCard icon={<FileText size={15} />} label="Bio" hint="A short description about you">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell people a little about yourself…"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-[14px] py-[11px] text-[14.5px] text-[#e8e8e8] outline-none font-[inherit] resize-none leading-relaxed transition-colors duration-150 focus:border-white/[0.22] focus:bg-white/[0.07] placeholder:text-white/[0.18]"
              />
            </FieldCard>
          </div>
        </div>

        {/* Buttons — mobile only */}
        <div className="flex lg:hidden gap-[10px] mt-2">
          <ActionButtons saving={saving} onCancel={handleCancel} onSave={handleSave} />
        </div>

      </div>
    </div>
  );
};

/* ── Field card ── */
const FieldCard = ({ icon, label, hint, children }) => (
  <div className="bg-[#161616] border border-white/[0.08] rounded-[14px] px-5 py-[18px] flex flex-col gap-[10px]">
    <label className="flex items-center gap-[7px] text-[12.5px] font-medium text-[#888] uppercase tracking-[0.055em] m-0">
      <span className="flex items-center text-[#555]">{icon}</span>
      {label}
    </label>
    {children}
    {hint && <p className="text-[12px] text-[#555] mt-[2px] mb-0">{hint}</p>}
  </div>
);

/* ── Shared action buttons ── */
const ActionButtons = ({ saving, onCancel, onSave }) => (
  <>
    <button
      onClick={onCancel}
      className="flex-1 py-[11px] rounded-[10px] border border-white/[0.08] bg-transparent text-[#888] text-[13.5px] font-medium cursor-pointer transition-colors duration-150 hover:bg-white/[0.06] hover:text-[#e8e8e8]"
    >
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={saving}
      className="flex-1 py-[11px] rounded-[10px] bg-[#e8e8e8] text-[#0d0d0d] text-[13.5px] font-semibold cursor-pointer flex items-center justify-center gap-[7px] transition-colors duration-150 hover:bg-[#d4d4d4] active:bg-[#b8b8b8] disabled:opacity-45 disabled:cursor-not-allowed"
    >
      {saving ? (
        <>
          <span className="inline-block w-[14px] h-[14px] rounded-full border-2 border-black/20 border-t-black animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <Save size={15} />
          Save changes
        </>
      )}
    </button>
  </>
);

export default EditProfile;