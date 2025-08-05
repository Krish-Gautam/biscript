'use client'
import React from 'react'
import { que_data } from '../../quedata/questions'
import Link from 'next/link'
import {useParams} from 'next/navigation'

export default function QuestionPage() {
     const params=useParams();
  // Get the question ID from the URL parameters
  const questionId = parseInt(params.id)
  
  // Find the specific question by ID
  const question = que_data.find(item => item.id === questionId)
  
  // If question not found, show error
  if (!question) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Question Not Found</h1>
          <p className="text-gray-400 mb-6">The question you're looking for doesn't exist.</p>
          <Link 
            href="/challenges" 
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl transition-colors border border-white/10"
          >
            Back to Challenges
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            href="/challenges" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Challenges
          </Link>
          
          {/* Question Card */}
          <div className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 px-8 py-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">#{question.id}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Challenge {question.id}</h1>
                    <p className="text-gray-400 text-sm">Python Programming</p>
                  </div>
                </div>
                <span className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {question.category}
                </span>
              </div>
            </div>
            
            {/* Question Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Problem Statement</h2>
              <div className="bg-neutral-800/50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-gray-200 leading-relaxed">
                  {question.que}
                </p>
              </div>
              
              {/* Additional sections */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Difficulty</h3>
                  <p className="text-green-300">{question.category}</p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Challenge ID</h3>
                  <p className="text-blue-300">#{question.id}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-4">
                <Link 
                  href={`/challenges/question/${question.id}/code`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Start Coding
                </Link>
                <Link 
                  href={`/challenges/question/${question.id}/solution`} 
                  className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl transition-all duration-300 font-semibold"
                >
                  View Solution
                </Link>
              </div>
            </div>
          </div>
          
          {/* Navigation to other challenges */}
          <div className="flex justify-between mt-8">
            {questionId > 1 && (
              <Link 
                href={`/challenges/question/${questionId - 1}`}
                className="bg-neutral-800/60 hover:bg-neutral-700/60 text-white px-6 py-3 rounded-xl transition-colors border border-white/10 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Challenge
              </Link>
            )}
            
            {questionId < que_data.length && (
              <Link 
                href={`/challenges/question/${questionId + 1}`}
                className="bg-neutral-800/60 hover:bg-neutral-700/60 text-white px-6 py-3 rounded-xl transition-colors border border-white/10 flex items-center gap-2 ml-auto"
              >
                Next Challenge
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}