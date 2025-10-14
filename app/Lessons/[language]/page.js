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
  }, [language])

  const handleLanguageChange = (lang) => {
    window.location.href = `/Lessons/${lang}`;

  }

  const languages = ["React JavaScript", "Python", "Java", "Cpp", "C", "HTML", "CSS", "PHP", "Node Js", "Bash",];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014] text-white font-sans">
        <style>{`
          @media (max-width: 768px) {
            .sidebar {
              display: none !important;
              border-radius: 0 ;
            }
          }
          .desktop-sidebar {
            display: block !important;
            position: absolute;
            left: 0;
            top: 6vh;
            animation: sidebar-slide-in 0.6s cubic-bezier(0.4,0,0.2,1);
            z-index:999;
            height: 86vh;
          }

          @keyframes sidebar-slide-in {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @media (max-width: 768px) {
            .hidden-md {
              display: none
            }
          }
          .display-md{
            display: none;
          }
          @media (max-width: 768px) {
            .display-md {
              display: block;
            }
          }
          .md-rounded-t-2xl {
          @media (width >= 48rem /* 768px */) {
          border-top-left-radius: var(--radius-2xl) /* 1rem = 16px */;
          border-top-right-radius: var(--radius-2xl) /* 1rem = 16px */;
        }
      }
        .md-p-6 {
    @media (width >= 48rem /* 768px */) {
        padding: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
    }
}
        `}</style>
      <div className="flex flex-1 w-full h-full min-h-screen">
        {/* Sidebar */}
        <aside className="sidebar h-full min-h-screen w-[18%] bg-[#18181b] rounded-none shadow-xl p-6 space-y-6 border-r border-white/10 flex flex-col gap-0 sticky top-0 self-start">
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
        <main className="flex-1 flex flex-col gap-6 w-full p-2 md-p-6">
          <div className="animate-fade-in">
          {/* Topics */}
          <section className="flex gap-3 py-4 hide-scrollbar overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {languages.map((topic, i) => {
              const topicslug = topic.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link href={`/Lessons/${topicslug}`}>
                <span
                  key={i}
                  className={`inline-block px-5 py-2 rounded-full border border-white/10 shadow font-medium cursor-pointer transition-transform hover:scale-[1.1] select-none
                     ${topicslug === language
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#23272f] hover:bg-[#31343b] text-white'}`}
              >
                
                  {topic}
              </span>
                </Link>
            )})}
          </section>
          {/* Problem Cards */}
          <section className="flex flex-col animate-fade-in gap-6 w-full">
            {problems.map((problem, i) => (
              <Link href={`/questions/${language}/${problem.id}`} key={i}>
                <div
                  className="relative bg-[#18181b] hover:bg-[#23272f] border border-white/10 rounded-2xl p-6 animate-fade-in shadow-lg flex flex-col min-h-[160px] group w-full transition-transform hover:scale-[1.01]">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Problems;
