"use client";
import { motion } from "framer-motion";

const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`}></div>
);

export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1d] to-[#0f0f0f] text-white font-sans">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-[#18181b] rounded-3xl p-8 border border-white/10 shadow-xl">
            {/* Profile Image Skeleton */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-32 h-32 bg-gray-800 rounded-full mb-6 animate-pulse"></div>
              <div className="w-48 h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-800 rounded animate-pulse"></div>
            </div>
            
            {/* Edit Button Skeleton */}
            <div className="w-full h-12 bg-gray-800 rounded-xl mb-6 animate-pulse"></div>
            
            {/* About Section Skeleton */}
            <div className="mb-6">
              <div className="w-16 h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Location Skeleton */}
            <div className="w-full h-12 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Right Column - Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#18181b] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-6 bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-8 h-6 bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="w-24 h-4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Badges Section Skeleton */}
          <div className="bg-[#18181b] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gray-800 rounded animate-pulse"></div>
              <div className="w-32 h-5 bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#2a2a2d]/80 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-20 h-4 bg-gray-800 rounded mb-1 animate-pulse"></div>
                      <div className="w-16 h-3 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges Section Skeleton */}
          <div className="bg-[#18181b] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gray-800 rounded animate-pulse"></div>
              <div className="w-32 h-5 bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#2a2a2d]/80 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
                      <div>
                        <div className="w-32 h-4 bg-gray-800 rounded mb-1 animate-pulse"></div>
                        <div className="w-24 h-3 bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-16 h-4 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <div className="min-h-screen flex w-100vw flex-col items-center justify-center gap-12 px-6 py-16 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
    
    <div className="relative z-10">
      <div className="w-96 h-12 bg-gray-800 rounded mb-6 animate-pulse"></div>
      <div className="w-80 h-6 bg-gray-800 rounded mb-8 animate-pulse"></div>
    </div>

    <div className="rounded-3xl bg-white/10 p-1 border border-white/10 shadow-xl relative w-[1100px] max-w-full">
      <div className="rounded-3xl bg-black overflow-hidden relative h-[550px]">
        <div className="bg-[#16171A] h-10 px-4 flex justify-between items-center">
          <div className="flex items-center gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-20 left-20 bg-[#131416] h-[470px] w-[600px] border border-white/10 border-b-0 rounded-t-2xl">
          <div className="bg-[#17181A] w-full h-8 rounded-t-2xl flex items-center px-3">
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-12 right-28 w-[220px] bg-[#1D1F22] rounded-xl shadow-md p-4">
          <div className="w-32 h-5 bg-gray-800 rounded mb-3 animate-pulse"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-8 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ChallengeSkeleton = () => (
  <div className="min-h-screen bg-neutral-950">
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-gray-800 rounded animate-pulse"></div>
        <div className="w-48 h-8 bg-gray-800 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-neutral-900 rounded-lg p-6">
            <div className="w-32 h-6 bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-900 rounded-lg p-6">
            <div className="w-24 h-6 bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-900 rounded-lg p-6">
          <div className="w-32 h-6 bg-gray-800 rounded mb-4 animate-pulse"></div>
          <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 50 + 50}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CodeEditorSkeleton = () => (
  <div className="w-full h-full bg-gray-900 rounded-lg">
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-gray-800 rounded animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-800 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-8 bg-gray-800 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
    
    <div className="p-4 space-y-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
      ))}
    </div>
  </div>
);

export default {
  ProfileSkeleton,
  HomeSkeleton,
  ChallengeSkeleton,
  CodeEditorSkeleton,
};
