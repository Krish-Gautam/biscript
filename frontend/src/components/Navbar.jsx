"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";
import logo6 from "../assets/logo6.png";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Hydration fix: only show navbar after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add("dark"); // you can replace with theme state
  }, []);

  const handleLogout = () => {
  logout();
  navigate("/");
};

  if (!mounted || loading) {
    // Keep same height to avoid flicker
    return (
      <nav className="sticky top-0 z-50 w-full bg-neutral-900/80 border border-white/10 shadow-2xl px-6 py-2 flex items-center justify-between">
        <div className="w-full h-8 flex items-center justify-between animate-pulse">
          <div className="w-32 h-6 bg-gray-700 rounded"></div>
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-900/80 border border-white/10 shadow-2xl px-6 py-2 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">

        <img
          src={logo6}
          alt="Logo"
          width={120}
          height={50}
          style={{ objectFit: "contain", width: "120px", height: "40px" }}
        />

      </Link>

      {/* Links */}
      <div className="md:flex items-center gap-5">
        <Link to="/languages" className="nav-anim-link text-gray-200 font-medium px-2">Languages</Link>
        <Link to="/challenges" className="nav-anim-link text-gray-200 font-medium px-2">Challenges</Link>
        <Link to="/docs" className="nav-anim-link text-gray-200 font-medium px-2">Docs</Link>
        <Link to="/community" className="nav-anim-link text-gray-200 font-medium px-2">Community</Link>
      </div>

      {/* Auth/Profile */}
      <div className="flex items-center gap-2">
        {!user ? (
          <>
          <Link to="/login"><button
              
              className="px-4 py-1 rounded-md cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm"
            >
              Login
            </button>
            </Link>
            <Link to="/auth/register"><button
              className="px-4 py-1 rounded-md cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm"
            >
              Get Started
            </button></Link>

          </>
        ) : (
          <div className="relative z-50">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex cursor-pointer items-center space-x-2 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
            >
              <User size={20} />
              <span>Profile</span>
              <ChevronDown size={16} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#252526] border border-gray-700 rounded shadow-lg z-50">
                <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors">
                  <User size={16} className="mr-2" /> Profile
                </Link>
                <Link to="/profile/edit" className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors">
                  <Settings size={16} className="mr-2" /> Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors w-full cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;



