'use client'
import React,{ useState} from 'react'
import { que_data } from './quedata/questions'
import QueBox from '../components/QueBox'

export default function Home() {
   const [menu,setMenu]=useState("All")
   console.log("imported quedata",que_data);
   
  return (
    <div className="min-h-screen bg-neutral-950 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 select-none">
              Coding Challenges
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto select-none">
              Test your programming skills with our curated collection of challenges. 
              From easy warm-ups to complex problem-solving.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button 
              onClick={()=>setMenu('All')}  
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                menu==="All"
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              All Challenges
            </button>
            <button 
              onClick={()=>setMenu('Popular')}  
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                menu==="Popular"
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              Popular
            </button>
            <button 
              onClick={()=>setMenu('Medium')}  
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                menu==="Medium"
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              Medium
            </button>
            <button 
              onClick={()=>setMenu('Easy')}  
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                menu==="Easy"
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10'
                  : 'bg-neutral-800/60 text-gray-300 border border-white/10 hover:bg-neutral-700/60'
              }`}
            >
              Easy
            </button>
          </div>

          {/* Challenges Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {que_data
              .filter((item) => menu === "All" ? true : item.category === menu)
              .map((item, index) => (
                <QueBox 
                  key={item.id || index} 
                  id={item.id} 
                  category={item.category} 
                  que={item.que} 
                />
              ))
            }
          </div>

          {/* Empty State */}
          {que_data.filter((item) => menu === "All" ? true : item.category === menu).length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
              <p className="text-gray-400">Try selecting a different category or check back later for new challenges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
