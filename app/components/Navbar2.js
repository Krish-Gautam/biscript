"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar2 = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('JavaScript');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New lesson available: React Hooks", time: "2m ago", read: false },
    { id: 2, message: "Your code submission was successful", time: "5m ago", read: false },
    { id: 3, message: "Weekly progress report ready", time: "1h ago", read: true },
  ]);

  const languages = [
    { name: 'JavaScript', icon: '⚡', color: 'bg-yellow-500' },
    { name: 'Python', icon: '🐍', color: 'bg-blue-500' },
    { name: 'Java', icon: '☕', color: 'bg-red-500' },
    { name: 'C++', icon: '⚙️', color: 'bg-purple-500' },
    { name: 'React', icon: '⚛️', color: 'bg-cyan-500' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="h-14 w-full bg-gradient-to-r from-[#1a1a1d] to-[#2a2a2d] border-b border-gray-700 shadow-lg">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Logo & Language */}
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-1 py-1 bg-[#2a2a2d] hover:bg-[#3a3a3d] rounded-lg transition-colors border border-gray-600"
            >
              <span className="text-lg">⚡</span>
              <span className="text-white font-medium">{currentLanguage}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>

            {/* Language Dropdown */}
            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#2a2a2d] border border-gray-600 rounded-lg shadow-xl z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => {
                      setCurrentLanguage(lang.name);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3a3a3d] transition-colors text-left"
                  >
                    <div className={`w-6 h-6 rounded-full ${lang.color} flex items-center justify-center text-white text-xs`}>
                      {lang.icon}
                    </div>
                    <span className="text-white font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="flex items-center gap-1">
          <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium">
            Lessons
          </button>
          <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium">
            Challenges
          </button>
          <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium">
            Leaderboard
          </button>
          <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium">
            Docs
          </button>
        </div>

        {/* Right Section - User & Notifications */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search lessons..."
              className="w-64 px-4 py-2 bg-[#2a2a2d] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-2.5">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>


          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center p-1 bg-[#2a2a2d] hover:bg-[#3a3a3d] rounded-lg transition-colors "
            >
              <div className="w-9 h-9  rounded-full flex items-center justify-center">
               <Image className='rounded-full' height={40} width={40} src="/profil.jpeg"/>
               
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
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                    Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                    Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isLanguageDropdownOpen || isProfileDropdownOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsLanguageDropdownOpen(false);
            setIsProfileDropdownOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar2;