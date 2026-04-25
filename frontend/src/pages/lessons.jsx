"use client"
import { getLessonByLanguage } from "../services/lessonServices";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const difficultyColors = {
  Easy: 'bg-green-600',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-600',
};

const Lessons = () => {
  const params = useParams();
  const { language } = params;
  const navigate = useNavigate(); // ✅ Fix: was used in handleLanguageChange but never imported
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await getLessonByLanguage(language);
        setProblems(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchLesson();
  }, [language]);

  const handleLanguageChange = (lang) => {
    navigate(`/Lessons/${lang}`);
  };

  const languages = ["React JavaScript", "Python", "Java", "Cpp", "C", "HTML", "CSS", "PHP", "Node Js", "Bash"];

  return (
    <div className="min-h-screen pt-12 flex flex-col bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014] text-white font-sans">
      <style>{`
        /* ✅ Fix: animate-fade-in was referenced everywhere but never defined */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* ✅ Fix: hide-scrollbar was referenced but never defined */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* ✅ Fix: sidebar hidden on mobile */
        @media (max-width: 768px) {
          .sidebar {
            display: none !important;
          }
        }

        /* ✅ Fix: sidebar slide-in animation — kept but scoped to sidebar only */
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

        .sidebar {
          animation: sidebar-slide-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ✅ Fix: .md-rounded-t-2xl — broken nested @media inside style tag, flattened */
        @media (min-width: 768px) {
          .md-rounded-t-2xl {
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
        }

        /* ✅ Fix: .md-p-6 — same broken nested @media, flattened */
        @media (min-width: 768px) {
          .md-p-6 {
            padding: 1.5rem;
          }
        }

        /* ✅ Fix: hidden-md / display-md helpers */
        @media (max-width: 768px) {
          .hidden-md {
            display: none;
          }
          .display-md {
            display: block;
          }
        }

        .display-md {
          display: none;
        }

        /* ✅ Fix: staggered card animations for problem list */
        .problem-card:nth-child(1) { animation-delay: 0.05s; }
        .problem-card:nth-child(2) { animation-delay: 0.10s; }
        .problem-card:nth-child(3) { animation-delay: 0.15s; }
        .problem-card:nth-child(4) { animation-delay: 0.20s; }
        .problem-card:nth-child(5) { animation-delay: 0.25s; }
        .problem-card:nth-child(6) { animation-delay: 0.30s; }
        .problem-card:nth-child(7) { animation-delay: 0.35s; }
        .problem-card:nth-child(8) { animation-delay: 0.40s; }
        .problem-card:nth-child(9) { animation-delay: 0.45s; }
        .problem-card:nth-child(10) { animation-delay: 0.50s; }
      `}</style>

      <div className="flex flex-1 w-full h-full min-h-screen">

        {/* ✅ Fix: removed conflicting min-h-screen from sticky sidebar — sticky + min-h-screen fight each other.
            sidebar now uses h-screen and overflow-y-auto for proper sticky scroll behavior */}
        <aside className="sidebar hidden md:flex h-screen w-[18%] bg-[#18181b] rounded-none shadow-xl p-6 space-y-6 border-r border-white/10 flex-col gap-0 sticky top-0 overflow-y-auto">
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
            <section className="flex gap-3 py-4 hide-scrollbar overflow-x-auto whitespace-nowrap">
              {languages.map((topic, i) => {
                const topicslug = topic.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={i}
                    to={`/Lessons/${topicslug}`}
                  >
                    <span
                      className={`inline-block px-5 py-2 rounded-full border border-white/10 shadow font-medium cursor-pointer transition-transform hover:scale-[1.1] select-none
                        ${topicslug === language
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#23272f] hover:bg-[#31343b] text-white'}`}
                    >
                      {topic}
                    </span>
                  </Link>
                );
              })}
            </section>

            {/* Problem Cards */}
            <section className="flex flex-col gap-6 w-full">
              {problems.map((problem, i) => (
                <Link to={`/questions/${language}/${problem._id}`} key={i}>
                  {/* ✅ Fix: added problem-card class for staggered animation delays */}
                  <div className="problem-card animate-fade-in relative bg-[#18181b] hover:bg-[#23272f] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col min-h-[160px] group w-full transition-transform hover:scale-[1.01]">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{problem.title}</h2>
                      <span className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold ${difficultyColors[problem.difficulty]} bg-opacity-80`}>
                        {problem.difficulty}
                      </span>
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

export default Lessons;