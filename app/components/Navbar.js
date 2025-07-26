"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();

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
    <>
    <nav className="sticky top-0 z-50 w-[96vw] w-full bg-neutral-900/80 backdrop-blur-lg border border-white/10 shadow-2xl px-6 py-2 flex items-center justify-between transition-all" style={{ minHeight: '48px' }}>
      {/* Logo & Brand */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-neutral-800/80 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-base font-bold">⚡</span>
        </div>
        <span className="text-lg font-bold text-white tracking-tight select-none">Biscript</span>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <Link href="/languages" className="text-gray-200 hover:text-white font-medium transition">Languages</Link>
        <Link href="/lessons" className="text-gray-200 hover:text-white font-medium transition">Lessons</Link>
        <button className="text-gray-200 hover:text-white font-medium transition bg-transparent">Challenges</button>
        <button className="text-gray-200 hover:text-white font-medium transition bg-transparent">Leaderboard</button>
      </div>

      {/* Auth/Profile */}
      <div className="flex items-center gap-2">
        {!session ? (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1 rounded-md text-gray-100 hover:text-white font-semibold transition border border-white/10 bg-neutral-800/60 backdrop-blur-sm shadow-sm text-sm"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold shadow-sm border border-white/10 transition text-sm"
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center p-1 hover:bg-[#3a3a3d] rounded-lg transition-colors "
              >
                <div className="w-9 h-9  rounded-full flex items-center justify-center">
                  <Image className='rounded-full' height={40} width={40} src="/profil.jpeg" />

                </div>

              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2d] border border-gray-600 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">User Name</p>
                        <p className="text-gray-400 text-xs">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href={'/profile'}>
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                        Profile
                      </button>
                    </Link>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                      Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
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
    </>
  );
};

export default Navbar;
