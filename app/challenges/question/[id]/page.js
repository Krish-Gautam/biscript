'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getChallengeData } from '@/app/services/getChallengeData'
import { ArrowLeft, Zap, Shield, Star, Code, Target, Clock, Users, Award, BookOpen } from 'lucide-react'
import { getTestCases } from '@/app/services/getTestCases'

export default function QuestionPage() {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [testCases, setTestCases] = useState([])
  

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const  challengedata = await getChallengeData(id)

        setQuestion(challengedata[0])
      }
      fetchData()
    }
  }, [id])

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return <Zap className="w-6 h-6 text-green-400" />
      case 'Medium': return <Shield className="w-6 h-6 text-yellow-400" />
      case 'Hard': return <Star className="w-6 h-6 text-red-400" />
      default: return <Target className="w-6 h-6 text-blue-400" />
    }
  }

  if (!question) {
    return <div className="text-center text-gray-400 mt-20">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link href="/challenges" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-5 h-5" /> Back to Challenges
        </Link>

        {/* Main card */}
        <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{question.title}</h1>
                <p className="text-gray-300">{question.short_description || "Sharpen your coding skills with this challenge."}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold shadow-lg">
              {getDifficultyIcon(question.category)}
              {question.category}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{question.points || 100}</div>
              <div className="text-gray-400 text-sm">Points</div>
            </div>
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <div className="text-2xl font-bold text-green-400">{question.timeLimit || '30 min'}</div>
              <div className="text-gray-400 text-sm">Time Limit</div>
            </div>
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{question.participants || 150}</div>
              <div className="text-gray-400 text-sm">Participants</div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Problem Overview</h2>
            </div>
            <p className="text-lg text-gray-200 leading-relaxed">
              {question.description}
            </p>
          </div>

          {/* Skills Tested */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-3">Skills Tested</h3>
            <div className="flex flex-wrap gap-3">
              {["Loops", "Conditionals", "Basic I/O", "Optimization"].map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300 border border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/challenges/question/${question.id}/code`}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg text-center"
            >
              Start Challenge
            </Link>
            <Link
              href={`/challenges`}
              className="flex-1 border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-center"
            >
              Browse More
            </Link>
          </div>
        </div>

        {/* Related challenges */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-4">Related Challenges</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-neutral-900 border border-white/10 rounded-xl p-5 hover:bg-neutral-800 transition">
                <h4 className="text-white font-semibold mb-2">Sample Challenge {idx + 1}</h4>
                <p className="text-gray-400 text-sm mb-3">Short description about this related challenge.</p>
                <Link href="/challenges/question/1" className="text-blue-400 text-sm hover:underline">View Challenge</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
