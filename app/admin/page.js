
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLessons } from "../services/getLessons";
import { getQuestion } from "../services/getQuestions";
import { getGoblinLines } from "../services/getGoblinLines";
import { getChallenges } from "../services/getChallenges";

/* -------------------- CONFIG -------------------- */

const LANGUAGES = ["javascript", "python", "c++", "java"];
const CHALLENGE_TYPES = ["solo", "competitive", "collaborative"];

/* -------------------- MOCK DATA (REPLACE LATER) -------------------- */

const mockLessons = {
  javascript: [
    { id: 1, title: "Variables", description: "JS variables" },
    { id: 2, title: "Loops", description: "JS loops" },
  ],
  python: [{ id: 3, title: "Basics", description: "Python basics" }],
};

const mockQuestions = {
  1: [{ id: 11, text: "What is let?" }],
  2: [{ id: 12, text: "Explain for loop" }],
};

const mockScripts = {
  1: [{ id: 21, message: "Hi, I am Goblin 👋" }],
};

const mockChallenges = {
  solo: [{ id: 101, title: "Reverse String" }],
  competitive: [{ id: 102, title: "Fastest Sort" }],
  collaborative: [{ id: 103, title: "Build Chat App" }],
};



/* -------------------- COMPONENT -------------------- */

export default function AdminPanel() {
  const router = useRouter();
  /* -------- Global UI State -------- */
  const [mode, setMode] = useState("lessons"); // lessons | challenges
  const [activeEditor, setActiveEditor] = useState(null);

  /* -------- Lessons State -------- */
  const [language, setLanguage] = useState("python");
  const [allLessons, setAllLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openLessons, setOpenLessons] = useState({});
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  const [lessonScripts, setLessonScripts] = useState({})
  const [lessonTab, setLessonTab] = useState("overview"); // overview | questions | scripts
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  /* -------- Challenges State -------- */
  const [challengeType, setChallengeType] = useState("solo");

  useEffect(() => {
    setIsLoadingLessons(true);
    const fetchLessons = async () => {
      if (language) {
        try {
          const data = await getLessons(language.toLowerCase());
          setAllLessons(data);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        } finally {
          setIsLoadingLessons(false);
        }
      }
    };
    fetchLessons();
  }, [language]);

  const handleChallengeClick = async (type) => {
    setChallengeType(type);

    try {
      const { data } = await getChallenges(type);
      console.log(data)
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };


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
        setLessonScripts((prev) => ({ ...prev, [lesson.id]: scripts.data[0] }));
      } catch (error) {
        console.error("Error fetching scripts:", error);
      } finally {
        setIsLoadingScripts((prev) => ({ ...prev, [lesson.id]: false }));
      }
    }
  };


  /* -------------------- RENDER -------------------- */

  return (
    <div className="flex h-screen bg-[#18181b] text-white">
      {/* ================= TOP MODE BAR ================= */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#1f1f23] border-b border-gray-700 flex items-center px-6 z-50">
        <button
          className={`mr-4 cursor-pointer px-4 py-1 rounded ${mode === "lessons" ? "bg-blue-600" : "bg-[#2a2a2d]"
            }`}
          onClick={() => {
            setMode("lessons");
            setActiveEditor(null);
          }}
        >
          Lessons Manager
        </button>

        <button
          className={`px-4 cursor-pointer py-1 rounded ${mode === "challenges" ? "bg-blue-600" : "bg-[#2a2a2d]"
            }`}
          onClick={() => {
            setMode("challenges");
            setActiveEditor(null);
          }}
        >
          Challenges Manager
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside className="flex flex-col w-80 bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d] border-r border-gray-700 p-4 space-y-4">
        {mode === "lessons" ? (
          <>
            <label className="text-sm text-gray-400">Language</label>
            <select
              className="w-full mt-1 mb-4 cursor-pointer bg-[#18181b] border border-gray-600 rounded p-2"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setSelectedLesson(null);
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <div className="space-y-2 ">
              {allLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full cursor-pointer text-left p-3 rounded ${selectedLesson?.id === lesson.id
                    ? "bg-gray-700"
                    : "bg-[#2a2a2d]"
                    }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>

            <button className="mt-4 w-full bg-green-600 rounded p-2 cursor-pointer"
              onClick={() => { router.push(`/admin/addLesson?language=${language}`) }}>
              + Add Lesson
            </button>
          </>
        ) : (
          <>
            <h4 className="mb-3 font-semibold">Challenge Types</h4>
            {CHALLENGE_TYPES.map((t) => (
              <button
                key={t}
                className={`w-full cursor-pointer mb-2 p-2 rounded ${challengeType === t ? "bg-gray-700" : "bg-[#2a2a2d]"
                  }`}
                onClick={() => handleChallengeClick(t)}
              >
                {t}
              </button>
            ))}
          </>
        )}
      </aside>

      {/* ================= MAIN WORKSPACE ================= */}
      <main className="flex-1 pt-20 p-8 overflow-y-auto hide-scrollbar">
        {mode === "lessons" && !selectedLesson && (
          <div className="text-gray-400 text-center">
            Select a lesson to manage it
          </div>
        )}

        {mode === "lessons" && selectedLesson && (
          <>
            <h2 className="text-xl font-bold mb-4">
              {selectedLesson.title}
            </h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              {["overview", "questions", "scripts"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-1 cursor-pointer rounded ${lessonTab === tab ? "bg-blue-600" : "bg-[#2a2a2d]"
                    }`}
                  onClick={() => setLessonTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview */}
            {lessonTab === "overview" && (
              <div className="bg-[#232526] p-4 rounded">
                <p>{selectedLesson.description}</p>
                <button
                  className="mt-3 bg-blue-600 cursor-pointer px-3 py-1 rounded"
                  onClick={() => router.push(`/admin/lesson?id=${selectedLesson.id}&language=${language}`)}
                >
                  Edit Lesson
                </button>
              </div>
            )}

            {/* Questions */}
            {lessonTab === "questions" && (
              <div className="space-y-2">
                {mockQuestions[selectedLesson.id]?.map((q) => (
                  <div
                    key={q.id}
                    className="bg-[#232526] p-3 rounded flex justify-between"
                  >
                    <span>{q.text}</span>
                    <button
                      className="bg-blue-600 px-2 rounded"
                      onClick={() =>
                        setActiveEditor({ type: "question", data: q })
                      }
                    >
                      Edit
                    </button>
                  </div>
                ))}
                <button className="bg-green-600 px-3 py-1 rounded">
                  + Add Question
                </button>
              </div>
            )}

            {/* Scripts */}
            {lessonTab === "scripts" && (
              <div className="space-y-2">
                {lessonScripts[selectedLesson.id]?.plan?.map((script, index) => (
                  <div
                    key={index} // index is OK here since order matters
                    className="bg-[#232526] p-3 rounded flex items-center justify-between"
                  >
                    <span>{script.message}</span>

                    <button
                      className="bg-blue-600 px-2 py-1 cursor-pointer rounded"
                      onClick={() =>
                        router.push(
                          `/admin/script?id=${lessonScripts[selectedLesson.id]?.id}`
                        )
                      }
                    >
                      Edit
                    </button>
                  </div>
                ))}

                <button className="bg-green-600 px-3 py-1 rounded">
                  + Add Script
                </button>
              </div>
            )}
          </>
        )}

        {mode === "challenges" && (
          <>
            <h2 className="text-xl font-bold mb-4 capitalize">
              {challengeType} Challenges
            </h2>

            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-[#232526] p-4 rounded mb-3 items-center flex justify-between gap-4"
              >
                {/* Left content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">
                      {c.title}
                    </h3>

                    {/* Category badge */}
                    {c.category && (
                      <span className="text-xs px-2 py-[4px] rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {c.category}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {c.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="bg-emerald-600 px-3 py-2 cursor-pointer h-fit rounded text-sm hover:bg-emerald-700 transition"
                    onClick={() => router.push(`/admin/addTestCases?challengeId=${c.id}`)}
                  >
                    Add TestCases
                  </button>

                  <button
                    className="bg-blue-600 px-3 py-2 cursor-pointer h-fit rounded text-sm hover:bg-blue-700 transition"
                    onClick={() => router.push(`/admin/challenges?challengeId=${c.id}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}


            <button className="mt-3 bg-green-600 cursor-pointer px-4 py-2 rounded" onClick={() => { router.push(`/admin/addChallenges?type=${challengeType}`) }}>
              + Add Challenge
            </button>
          </>
        )}
      </main>

      {/* ================= RIGHT EDITOR ================= */}

    </div>
  );
}
