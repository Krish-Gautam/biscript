'use client'
import React, { useEffect, useState } from 'react'
import { getChallenges } from '../services/getChallenges'
import { Trophy, Users, Target, Zap, Shield, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [challengeType, setChallengeType] = useState("solo")
  const [difficulty, setDifficulty] = useState("all");
  const [challenges, setChallenges] = useState([])
  const router = useRouter()

  useEffect( () => {
    const fetchChallenges = async () => {
      const { data, error } = await getChallenges(challengeType);
      if (error) {
        console.error("Error fetching challenges:", error);
      }
      setChallenges(data)
    }

    fetchChallenges();
  }, [challengeType])

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    }
  }

  const getChallengeTypeColor = (type) => {
    return type === 'solo' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  }

  const filteredSoloChallenges = challenges.filter(challenge => 
    difficulty === "all" ? true : challenge.category === difficulty
  )

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 select-none">
              Coding Challenges
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto select-none">
              Choose between solo competitive challenges to test your skills individually, 
              or collaborative challenges to work with teams and build amazing projects together.
            </p>
          </div>

          {/* Challenge Type Selection */}
          <div className="flex justify-center gap-6 mb-8">
            <button 
              onClick={() => setChallengeType('solo')}
              className={`flex cursor-pointer select-none items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                challengeType === 'solo'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              <Target className="w-5 h-5" />
              Solo
            </button>
            <button 
              onClick={() => setChallengeType('competitive')}
              className={`flex cursor-pointer select-noneitems-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                challengeType === 'competitive'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              <Target className="w-5 h-5" />
              Competitive
            </button>
            <button 
              onClick={() => setChallengeType('collaborative')}
              className={`flex items-center cursor-pointer select-none gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                challengeType === 'collaborative'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              <Users className="w-5 h-5" />
              Collaborative
            </button>
          </div>

          {/* Solo Challenge Difficulty Filters */}
          {challengeType === 'solo' && (
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => setDifficulty('all')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  difficulty === 'all'
                    ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                    : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
              >
                All Levels
              </button>
              <button 
                onClick={() => setDifficulty('Easy')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  difficulty === 'Easy'
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30 shadow-lg shadow-green-500/20'
                    : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Easy
                </span>
              </button>
              <button 
                onClick={() => setDifficulty('Medium')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  difficulty === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-500/20'
                    : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
              >
                <span className="flex items-center gap-2 ">
                  <Shield className="w-4 h-4" />
                  Medium
                </span>
              </button>
              <button 
                onClick={() => setDifficulty('Hard')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  difficulty === 'Hard'
                    ? 'bg-red-500/20 text-red-400 border border-red-400/30 shadow-lg shadow-red-500/20'
                    : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Hard
                </span>
              </button>
            </div>
          )}

          {/* Challenges Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {challengeType === 'solo' && (
              // Solo Challenges
              filteredSoloChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(challenge.category)}`}>
                      {challenge.category}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{challenge.points}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>

                  {/* Challenge Question */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-3">
                    {challenge.description}
                  </h3>

                  {/* Challenge Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {challenge.participants} participants
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {challenge.timeLimit}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button onClick={() => {router.push(`/challenges/question/${challenge.id}`)}} className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                    Start Challenge
                  </button>
                </div>
              ))
            )} 
            {challengeType === 'competitive' && (
              // Competitive Challenges
              challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getChallengeTypeColor(challenge.category)}`}>
                      {challenge.category}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{challenge.points}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>

                  {/* Challenge Question */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-3">
                    {challenge.description}
                  </h3>

                  {/* Challenge Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {challenge.timeLimit}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Team Size: {challenge.teamSize}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-400 transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
                    Join Team
                  </button>
                </div>
              ))
            )}
            {challengeType === 'collaborative' && (
              // Collaborative Challenges
              challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getChallengeTypeColor(challenge.category)}`}>
                      {challenge.category}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{challenge.points}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>

                  {/* Challenge Question */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-3">
                    {challenge.description}
                  </h3>

                  {/* Challenge Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {challenge.timeLimit}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Team Size: {challenge.teamSize}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-400 transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
                    Join Team
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {challengeType === 'solo' && filteredSoloChallenges.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
              <p className="text-gray-400">Try selecting a different difficulty level or check back later for new challenges.</p>
            </div>
          )}

          {challengeType === 'collaborative' && challenges.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-2">No collaborative challenges available</h3>
              <p className="text-gray-400">Check back later for team-based challenges and hackathons.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
