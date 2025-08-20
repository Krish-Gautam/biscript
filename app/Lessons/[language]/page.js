"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getLessons } from '@/app/services/getLessons';
import { useParams } from 'next/navigation';

const difficultyColors = {
  Easy: 'bg-green-600',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-600',
};

const Problems = () => {
  const params = useParams()
  const { language } = params
  const [problems, setProblems] = useState([])

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessons(language)
      setProblems(data)
    }

    fetchLessons()
  }, [])

  const handleLanguageChange = (lang) => {
    window.location.href = `/Lessons/${lang}`;
  }

  const languages = ["React JavaScript", "Python", "Java", "C++", "C", "C#", "HTML", "CSS", "PHP", "Node Js", "Bash",];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014] text-white font-sans">
      <div className="flex flex-1 w-full h-full min-h-screen">
        {/* Sidebar */}
        <aside className="h-full min-h-screen w-[18%] bg-[#18181b] rounded-none shadow-xl p-6 space-y-6 border-r border-white/10 flex flex-col gap-0 sticky top-0 self-start">
          <div className="flex items-center gap-3 bg-[#23272f] hover:bg-[#31343b] transition p-3 rounded-xl cursor-pointer shadow-sm">
            <span className="text-xl">📚</span>
            <span className="text-base font-medium">Library</span>
          </div>
          <div className="flex items-center gap-3 bg-[#23272f] hover:bg-[#31343b] transition p-3 rounded-xl cursor-pointer shadow-sm">
            <span className="text-xl">📝</span>
            <span className="text-base font-medium">Study Plan</span>
          </div>
          <hr className="border-white/20 my-4" />
          <div className="flex items-center gap-3 bg-[#23272f] hover:bg-[#31343b] transition p-3 rounded-xl cursor-pointer shadow-sm">
            <span className="text-xl">❤️</span>
            <span className="text-base font-medium">Favorites</span>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 w-full p-6">
          {/* Topics */}
          <section className="flex gap-3 p-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {languages.map((topic, i) => (
                <span
                onClick={() =>handleLanguageChange(topic.toLowerCase())}
                key={i}
                className={`px-5 py-2 rounded-full border border-white/10 shadow font-medium cursor-pointer transition-transform hover:scale-[1.1] select-none
                     ${topic.toLowerCase() === language
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#23272f] hover:bg-[#31343b] text-white'}`}
              >
                {topic}
              </span>
            ))}
          </section>
          {/* Problem Cards */}
          <section className="flex flex-col gap-6 w-full">
            {problems.map((problem, i) => (
              <Link href={`/questions/${language}/${problem.id}`} key={i}>
                <div
                  className="relative bg-[#18181b] hover:bg-[#23272f] border border-white/10 rounded-2xl p-6 transition-all shadow-lg flex flex-col min-h-[160px] group w-full transition-transform hover:scale-[1.01]">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{problem.title}</h2>
                    <span className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold ${difficultyColors[problem.difficulty]} bg-opacity-80`}>{problem.difficulty}</span>
                  </div>
                  <p className="text-gray-400 mt-1 text-sm md:text-base leading-relaxed flex-1">{problem.description}</p>
                  <div className="mt-4 text-sm text-blue-400 cursor-pointer hover:underline font-medium select-none">View Details →</div>
                </div>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Problems;
