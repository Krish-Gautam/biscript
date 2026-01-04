
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLessons } from "../services/getLessons";
import { getQuestion } from "../services/getQuestions";
import { getGoblinLines } from "../services/getGoblinLines";
import { Lemonada } from "next/font/google";

const languageOptions = [
  { id: 63, name: "javaScript" },
  { id: 71, name: "python" },
  { id: 54, name: "c++" },
  { id: 62, name: "java" },
];

export default function AdminPanel() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState(languageOptions[0].name);
  const [allLessons, setAllLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [openLessons, setOpenLessons] = useState({});
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  const [lessonScripts, setLessonScripts] = useState({})
  const [selectedChallengeType, setSelectedChallengeType] = useState("solo");

// TEMP placeholder data (replace later)
const challengesByType = {
  solo: [
    { id: 1, title: "Arrays Warmup" },
    { id: 2, title: "String Reverse" },
  ],
  competitive: [
    { id: 3, title: "Fastest Fibonacci" },
  ],
  collaborative: [
    { id: 4, title: "Build Todo App Together" },
  ],
};


  useEffect(() => {
    setIsLoadingLessons(true);
    const fetchLessons = async () => {
      if (currentLanguage) {
        try {
          const data = await getLessons(currentLanguage.toLowerCase());
          setAllLessons(data);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        } finally {
          setIsLoadingLessons(false);
        }
      }
    };
    fetchLessons();
  }, [currentLanguage]);

  const handleLessonClick = async (lesson) => {
    setSelectedLesson(lesson);
    if (!lessonQuestions[lesson.id]) {
      setIsLoadingQuestions((prev) => ({ ...prev, [lesson.id]: true }));
      try {
        const questions = await getQuestion(lesson.id);
        setLessonQuestions((prev) => ({ ...prev, [lesson.id]: questions }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoadingQuestions((prev) => ({ ...prev, [lesson.id]: false }));
      }
    }
    if (!lessonScripts[lesson.id]) {
      setIsLoadingScripts((prev) => ({ ...prev, [lesson.id]: true }));
      try {
        const scripts = await getGoblinLines(lesson.id);
        setLessonScripts((prev) => ({ ...prev, [lesson.id]: scripts }));
      } catch (error) {
        console.error("Error fetching scripts:", error);
      } finally {
        setIsLoadingScripts((prev) => ({ ...prev, [lesson.id]: false }));
      }
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleScriptClick = (script) => {
    setSelectedScript(script);
  };



  return (
    <div className="flex min-h-screen bg-[#18181b] text-white">
      {/* Sidebar */}
      <div className="flex flex-col w-80 bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d] border-r border-gray-700 p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <div>
          <label className="block mb-1 text-gray-300">Select Language</label>
          <select
            value={currentLanguage}
            onChange={e => setCurrentLanguage(e.target.value)}
            className="w-full px-2 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {languageOptions.map(lang => (
              <option key={lang.id} value={lang.name}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {isLoadingLessons ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              <span className="ml-3 text-gray-400 text-sm">Loading lessons...</span>
            </div>
          ) : allLessons.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📝</div>
              <p className="text-gray-400 text-sm">No lessons found</p>
            </div>
          ) : (
            allLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between select-none group ${selectedLesson?.id === lesson.id
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                  : 'bg-[#2a2a2d] hover:bg-[#3a3a3d] text-gray-200 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedLesson?.id === lesson.id ? 'bg-white scale-125' : 'bg-gray-400'}`}></div>
                  <span className="font-medium text-sm truncate">{lesson.title}</span>
                </div>
                <span className="text-xs">{selectedLesson?.id === lesson.id ? '✔' : ''}</span>
              </button>
            ))
          )}

          <div className="text-center Add bg-[#2A2A2D]  rounded-lg cursor-pointer">
            <button className="cursor-pointer text-center p-3 w-full  select-none" onClick={() => { router.push(`/admin/addLesson?language=${currentLanguage}`) }}>Add Lesson</button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-10">
        {!selectedLesson ? (
          <div className="max-w-xl mx-auto bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700 text-center">
            <h3 className="text-xl font-semibold mb-4">Welcome, Admin!</h3>
            <p className="text-gray-400 mb-4">Select a lesson from the sidebar to view or manage its details, questions, and scripts.</p>
            <button
              className="mt-4 px-6 py-2 bg-[#28c244] text-white rounded-lg font-semibold hover:bg-green-600 transition"
              onClick={() => router.push("/admin/lesson")}
            >
              ➕ Add New Lesson
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{selectedLesson.title}</h3>
              <div className="flex gap-2">
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                  onClick={() => router.push(`/admin/lesson?id=${selectedLesson.id}&language=${currentLanguage}`)}
                >
                  Edit Lesson
                </button>
                <button
                  className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                  onClick={() => router.push(`/admin/addQuestion?lessonId=${selectedLesson.id}`)}
                >
                  Add Question
                </button>
                <button
                  className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition cursor-pointer"
                  onClick={() => router.push(`/admin/addScript?lessonId=${selectedLesson.id}`)}
                >
                  Add Script
                </button>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-gray-400">Language: </span>
              <span className="font-medium">{selectedLesson.language || currentLanguage.name}</span>
            </div>
            <div className="mb-6">
              <span className="text-gray-400">Description: </span>
              <span className="font-medium">{selectedLesson.description || "No description."}</span>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Questions</h4>
              {isLoadingQuestions[selectedLesson.id] ? (
                <div className="text-gray-400">Loading questions...</div>
              ) : lessonQuestions[selectedLesson.id]?.length === 0 ? (
                <div className="text-gray-500">No questions available.</div>
              ) : (
                <ul className="space-y-2">
                  {lessonQuestions[selectedLesson.id]?.map((question) => (
                    <li key={question.id} className="bg-[#18181b] rounded p-3 flex items-center justify-between">
                      <span className="text-gray-200 select-none">{question.question_text}</span>
                      <button
                        className="text-xs px-2 py-1 bg-blue-700 rounded text-white hover:bg-blue-800"
                        onClick={() => router.push(`/admin/question?id=${question.id}`)}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Scripts</h4>
              {isLoadingScripts[selectedLesson.id] ? (
                <div className="text-gray-400">Loading scripts...</div>
              ) : lessonScripts[selectedLesson.id]?.length === 0 ? (
                <div className="text-gray-500">No scripts available.</div>
              ) : (
                <ul className="space-y-2">
                  {Array.isArray(lessonScripts[selectedLesson.id]?.data) &&
                    lessonScripts[selectedLesson.id].data.map((script) => (
                      <li key={script.id} className="bg-[#18181b] rounded p-3 flex items-center justify-between">
                        <span className="text-gray-200 select-none">
                          {script.plan.message} {/* Or whatever field you want to show */}
                        </span>
                        <button
                          className="text-xs px-2 py-1 bg-yellow-700 rounded text-white hover:bg-yellow-800"
                          onClick={() => router.push(`/admin/script?id=${script.id}`)}
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

// import React from "react";
// import ChatBox from "./ChatBox";

// export default function AIChatPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0b0b0c] via-[#131516] to-[#0a0a0a] p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl md:text-4xl font-bold text-white">AI Chat</h1>
//           <p className="text-gray-400 mt-1">A simple chat interface that talks to the Biscript AI (local Ollama backend).</p>
//         </div>
//         <ChatBox />
//       </div>
//     </div>
//   );
// }
