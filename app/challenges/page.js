'use client'
import React, { useEffect, useState } from 'react'
import { getChallenges } from '../services/getChallenges'
import { Trophy, Users, Target, Zap, Shield, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [challengeType, setChallengeType] = useState("solo")
  const [challenges, setChallenges] = useState([])
  const [difficulty, setDifficulty] = useState("all");
  const [isLoading, setIsLoading] = useState(false)
  const [challengeMap, setChallengeMap] = useState({
    solo: [],
    competitive: [],
    collaborative: []
  });

  const router = useRouter()

 useEffect(() => {
  if (challengeMap[challengeType]?.length) return;

  (async () => {
    const { data } = await getChallenges(challengeType);
    setChallengeMap(prev => ({
      ...prev,
      [challengeType]: data
    }));
  })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [challengeType]);


  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    }
  }

  const getChallengeTypeColor = (type) => {
    return type === 'solo' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  }

  const filteredSoloChallenges = React.useMemo(() => {
    const solo = challengeMap.solo;
    if (difficulty === "all") return solo;
    return solo.filter(c => c.category === difficulty);
  }, [difficulty, challengeMap.solo]);

  const visibleChallenges =
    challengeType === "solo"
      ? filteredSoloChallenges
      : challengeMap[challengeType];


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
              className={`flex cursor-pointer select-none items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${challengeType === 'solo'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
            >
              <Target className="w-5 h-5" />
              Solo
            </button>
            <button
              onClick={() => setChallengeType('competitive')}
              className={`flex cursor-pointer select-noneitems-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${challengeType === 'competitive'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                }`}
            >
              <Target className="w-5 h-5" />
              Competitive
            </button>
            <button
              onClick={() => setChallengeType('collaborative')}
              className={`flex items-center cursor-pointer select-none gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${challengeType === 'collaborative'
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
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${difficulty === 'all'
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
                  }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setDifficulty('Easy')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${difficulty === 'Easy'
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
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${difficulty === 'Medium'
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
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${difficulty === 'Hard'
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
            {isLoading && (
              <div className="col-span-full text-center text-gray-400">
                Loading challenges...
              </div>
            )}

            {!isLoading && visibleChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                type={challengeType}
                getDifficultyColor={getDifficultyColor}
                onStart={() =>
                  router.push(`/challenges/question/${challenge.id}`)
                }
              />

            ))}
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

const ChallengeCard = React.memo(function ChallengeCard({
  challenge,
  type,
  onStart,
  getDifficultyColor,
}) {
 return (
  <div className="h-full bg-gradient-to-br from-neutral-900 to-neutral-800 
    rounded-2xl px-4 py-3 border border-white/10 shadow-xl 
    transition-transform duration-300 hover:scale-[1.03]
    flex flex-col"
  >
    {/* Top Row */}
    <div className="flex items-center justify-between mb-2">
      <div
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(challenge.category)}`}
      >
        {challenge.category}
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-blue-400">
          {challenge.points}
        </div>
        <div className="text-xs text-gray-400">points</div>
      </div>
    </div>

    {/* Title */}
    <h2 className="text-lg font-bold text-white mb-1 line-clamp-2 min-h-[3rem]">
      {challenge.title}
    </h2>

    {/* Description */}
    <p className="text-sm text-gray-300 mb-3 line-clamp-3 min-h-[4.5rem]">
      {challenge.description}
    </p>

    {/* CTA — locked to bottom */}
    <button
      onClick={onStart}
      className="mt-auto cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-500 
        text-white py-3 rounded-xl font-semibold 
        hover:from-blue-500 hover:to-blue-400 transition-all"
    >
      {type === "solo" ? "Start Challenge" : "Join Team"}
    </button>
  </div>
);

});
