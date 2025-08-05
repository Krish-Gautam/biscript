import React from 'react'
import Link from 'next/link'
import { que_data } from '../challenges/quedata/questions';

const QueBox = ({ id, category, que, index }) => {
  // Get category color
  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Popular':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Link href={`/challenges/question/${id}`}>
      <div className="group relative bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-neutral-800/60 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-white/5 cursor-pointer">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">#{id}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
            <div className="text-gray-400 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Challenge Description */}
          <div className="mb-6">
            <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed line-clamp-3">
              {que}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>5-10 min</span>
            </div>
            
            <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-sm font-medium">Start Challenge</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default QueBox