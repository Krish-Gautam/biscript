"use client";
import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
        router.push("/");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setSession(null);
    }
  };


  return (
    <Suspense fallback={<div className="w-full h-12 bg-neutral-900 animate-pulse flex items-center px-6"><div className="w-32 h-6 bg-gray-700 rounded mr-4"></div><div className="w-16 h-6 bg-gray-700 rounded"></div></div>}>
      <nav className="sticky top-0 z-50  w-full bg-neutral-900/80 backdrop-blur-lg border border-white/10 shadow-2xl px-6 py-2 flex items-center justify-between transition-all" style={{ minHeight: '48px' }}>
        <style>{`
          .nav-anim-link {
            position: relative;
            transition: color 0.3s cubic-bezier(.4,0,.2,1);
          }
          .nav-anim-link:after {
            content: '';
            position: absolute;
            left: 0; bottom: -2px;
            width: 100%; height: 2px;
            background: linear-gradient(90deg,#38bdf8,#6366f1);
            transform: scaleX(0);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          }
          .nav-anim-link:hover {
            color: #38bdf8;
          }
          .nav-anim-link:hover:after {
            transform: scaleX(1);
          }
          .profile-dropdown-anim {
            transition: opacity 0.2s, transform 0.2s;
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          .group:hover .profile-dropdown-anim {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        `}</style>
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-neutral-800/80 rounded-lg flex items-center justify-center shadow-sm select-none">
            <span className="text-white text-base font-bold">⚡</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight select-none">Biscript</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/languages" className="nav-anim-link text-gray-200 font-medium px-2" prefetch={true}>Languages</Link>
          <Link href="/challenges" className="nav-anim-link text-gray-200 font-medium px-2" prefetch={true}>Challenges</Link>
          <Link href="/docs" className="nav-anim-link text-gray-200 font-medium px-2" prefetch={true}>Docs</Link>
          <Link href="/community" className="nav-anim-link text-gray-200 font-medium px-2" prefetch={true}>Community</Link>
        </div>

        {/* Auth/Profile */}
        <div className="flex items-center gap-2">
          {!session ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="cursor-pointer px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold shadow-sm border border-white/10 transition text-sm"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signin")}
                className="cursor-pointer px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold shadow-sm border border-white/10 transition text-sm"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              {/* Profile Dropdown */}
              <div className="relative group z-[9999]">
                <button className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-1 rounded transition-colors cursor-pointer">
                  <User size={20} />
                  <span>Profile</span>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown (still inside same group) */}
                <div className="absolute right-0 mt-2 w-48 bg-[#252526] border border-gray-700 rounded shadow-lg 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                  group-hover:translate-y-0 transform -translate-y-2 
                  transition-all duration-200 z-[9999]">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <User size={16} className="mr-2" /> Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <Settings size={16} className="mr-2" /> Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors w-full cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </div>

            </>
          )
          }
        </div >
      </nav>
      {/* Click outside to close dropdowns */}
      {(isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
  </Suspense>
  );
};

export default Navbar;
