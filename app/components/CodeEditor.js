"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { getLessons } from "@/app/services/getLessons";
import { getQuestion } from "@/app/services/getQuestions";
import GoblinBox from "./GoblinBox";
import { getGoblinLines } from "../services/getGoblinLines";
import { deserializePlan } from "../services/deserializedPlan";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { set } from "nprogress";

/* ---------------------------------- Setup ---------------------------------- */

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript, },
  { id: 71, name: "Python", langExt: python },
  { id: 54, name: "C++", langExt: cpp },
  { id: 62, name: "Java", langExt: java },
];
const pistonLangMap = {
  JavaScript: { piston: "javascript", ext: "js" },
  Python: { piston: "python", ext: "py" },
  "C++": { piston: "cpp", ext: "cpp" },
  Java: { piston: "java", ext: "java" },
};

/* =============================== MAIN COMPONENT =============================== */

export default forwardRef(function CodeEditor({ initialLanguage, initialLesson, onLanguageChanged }, ref) {
  /* ------------------------------- State Setup ------------------------------- */
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorHeight, setEditorHeight] = useState(60);
  const [language, setLanguage] = useState(null);
  const [canCheckInput, setCanCheckInput] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastReaction, setLastReaction] = useState(null);
  const [stepMessageShown, setStepMessageShown] = useState(false);
  const router = useRouter();

  // Sidebar & Lessons
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [openLessons, setOpenLessons] = useState({});
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState({});

  // Goblin teaching system
  const [goblinLine, setGoblinLine] = useState("");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [goblinTeaching, setGoblinTeaching] = useState(null);
  const [lessonStepIndex, setLessonStepIndex] = useState(0);
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // User progress
  const [userProfile, setUserProfile] = useState({
    name: "Anonymous Toad",
    mistakes: [],
    completedLessons: [],
    goblinMood: "neutral",
  });

  // Refs for timers & drag handling
  const autoAdvanceTimeoutRef = useRef(null);
  const checkInputTimeoutRef = useRef(null);
  const isDragging = useRef(false);

  /* ------------------------------- Initialization ------------------------------- */
  useEffect(() => {
    if (!initialLanguage) return;
    const formattedLang =
      initialLanguage.charAt(0).toUpperCase() + initialLanguage.slice(1).toLowerCase();
    const matchedLang = languageOptions.find((l) => l.name === formattedLang);
    setLanguage(matchedLang || languageOptions[0]);
    if (onLanguageChanged) {
      onLanguageChanged((matchedLang || languageOptions[0]).name);
    }

    const fetchLessons = async () => {
      setIsLoadingLessons(true);
      try {
        const data = await getLessons(initialLanguage);
        // Sort lessons by lessonNumber (ascending)
        const sortedLessons = data.sort((a, b) => a.lessonNumber - b.lessonNumber)
        setLessons(sortedLessons);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [initialLanguage, onLanguageChanged]);

  // Auto-select initial lesson
  useEffect(() => {
    if (!initialLesson || lessons.length === 0) return;
    const handleLessonInitialization = async (lesson) => {
      setCurrentLesson(lesson);
      setOpenLessons((prev) => ({ ...prev, [lesson.id]: true }));

      const commentPrefix = { JavaScript: "//", Python: "#", "C++": "//", Java: "//" };
      setCode(`${commentPrefix[language?.name || "JavaScript"]} ${lesson.title}\n\n`);

      if (!lessonQuestions[lesson.id]) {
        const questions = await getQuestion(lesson.id);
        setLessonQuestions((prev) => ({ ...prev, [lesson.id]: questions }));
      }

      resetTeachingFlow();
    };
    const lesson = lessons.find(
      (l) => l.id === initialLesson
    );
    if (lesson) handleLessonInitialization(lesson);
  }, [initialLesson, lessons, lessonQuestions, language?.name]);

  // Fetch goblin teaching for current lesson
  useEffect(() => {
    if (!currentLesson) return;
    const fetchGoblinTeaching = async () => {
      const { data } = await getGoblinLines(currentLesson.id);
      if (data?.length > 0) {
        setGoblinTeaching(deserializePlan(data[0].plan || []));
      }
    };
    fetchGoblinTeaching();
  }, [currentLesson]);

  // helper function to clear both timers safely
  const clearTimers = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (checkInputTimeoutRef.current) {
      clearTimeout(checkInputTimeoutRef.current);
      checkInputTimeoutRef.current = null;
    }
  };

  // Step 1: Show message once on step load, with auto-advance timers gated by start
  useEffect(() => {
    const currentStep = goblinTeaching?.[lessonStepIndex];
    if (!currentStep || !isLessonStarted) return;

    // always clear old timers before new ones
    clearTimers();

    setGoblinLine(currentStep.message);
    setLastReaction(null);
    setStepMessageShown(true);
    setCanCheckInput(false); // block reaction for now

    if (!currentStep.waitFor) {
      const baseTimePerChar = 90; // ms per character
      const minTime = 5000;
      const maxTime = 12000;

      const messageLength = currentStep.message.length;
      const calculatedTime = Math.min(
        Math.max(messageLength * baseTimePerChar, minTime),
        maxTime
      );

      autoAdvanceTimeoutRef.current = setTimeout(() => {
        setLessonStepIndex((prev) => prev + 1);
      }, calculatedTime);
    } else {
      // Only allow checking after some time
      checkInputTimeoutRef.current = setTimeout(() => {
        setCanCheckInput(true);
      }, 8000);
    }

    return clearTimers; // cleanup on step change
  }, [lessonStepIndex, goblinTeaching, isLessonStarted]);

  // Step 2: Handle waitFor + reactions
  useEffect(() => {
    const currentStep = goblinTeaching?.[lessonStepIndex];
    if (!currentStep || !currentStep.waitFor || !canCheckInput || !isLessonStarted) return;

    const passed = currentStep.waitFor(code, output);
    if (passed) {
      setLessonStepIndex((prev) => prev + 1);
      setStepMessageShown(false);
      setLastReaction(null);
      return;
    }

    if (currentStep.reactions?.length) {
      const matched = currentStep.reactions.find((r) => r.trigger(code, output));
      if (matched && matched !== lastReaction) {
        setGoblinLine(matched.response);
        setLastReaction(matched);
        setStepMessageShown(false);
        setUserProfile((prev) => ({
          ...prev,
          mistakes: [...prev.mistakes, { step: currentStep.trigger, code }],
        }));
        return;
      }
    }

    // const attempts = userProfile.mistakes.filter(m => m.step === currentStep.trigger).length;
    // if (attempts >= 3 && currentStep.hint && lastReaction?.response !== currentStep.hint) {
    //   setGoblinLine(`Ugh, okay fine. Here's a hint: ${currentStep.hint}`);
    //   setLastReaction({ response: currentStep.hint });
    //   return;
    // }
  }, [code, output, goblinTeaching, lessonStepIndex, canCheckInput, isLessonStarted, lastReaction]);

  // Final cleanup: clear timers on unmount
  useEffect(() => clearTimers, []);

  /* ------------------------------- Lesson Handlers ------------------------------- */

  const handleLessonClick = async (lesson) => {
    // navigate to the new lesson route
    router.push(`/questions/${initialLanguage}/${lesson.id}`);
  };

  const toggleLesson = async (lessonId) => {
    setOpenLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
    if (!lessonQuestions[lessonId]) {
      setIsLoadingQuestions((prev) => ({ ...prev, [lessonId]: true }));
      const questions = await getQuestion(lessonId);
      setLessonQuestions((prev) => ({ ...prev, [lessonId]: questions }));
      setIsLoadingQuestions((prev) => ({ ...prev, [lessonId]: false }));
    }
  };

  const resetTeachingFlow = () => {
    clearTimeout(autoAdvanceTimeoutRef.current);
    clearTimeout(checkInputTimeoutRef.current);
    setLessonStepIndex(0);
    setGoblinLine("");
    setIsLessonStarted(false);
  };

  /* ------------------------------- Editor Actions ------------------------------- */
  const runCode = async () => {
    if (!language) return;
    setLoading(true);
    setOutput("Running...");
    try {
      const res = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: language.id,
          }),
        }
      );

      const result = await res.json();
      const judgeOutput = result.stdout || result.stderr || "No output";
      setOutput(`${judgeOutput}`);

    } catch (err) {
      setOutput(err);
    } finally {
      setLoading(false);
    }
  };

  //   const runCode = async () => {
  //   if (!language) return;
  //   setLoading(true);
  //   setOutput("Running...");

  //   try {
  //     const langConfig = pistonLangMap[language.name]; // map your CodeMirror lang to Piston

  //     const res = await fetch("/api/piston/runCode", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         language: langConfig.piston, // "python", "javascript", etc.
  //         version: "3.12.0",
  //         files: [
  //           {
  //             name: `main.${langConfig.ext}`, // main.py, main.js, etc.
  //             content: code,
  //           },
  //         ],
  //       }),
  //     });

  //     const result = await res.json();

  //     const pistonOutput =
  //       result.run?.stdout || result.run?.stderr || "No output";

  //     setOutput(pistonOutput);
  //   } catch (err) {
  //     setOutput(err.message || "Error running code");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Toolkit exposed to parent via ref
  useImperativeHandle(ref, () => ({
    run: runCode,
    reset: () => {
      const commentPrefix = { JavaScript: "//", Python: "#", "C++": "//", Java: "//" };
      const lessonTitle = currentLesson?.title || (initialLesson ? String(initialLesson) : "");
      setCode(`${commentPrefix[language?.name || "JavaScript"]} ${lessonTitle}\n\n`);
      setOutput("");
    },
    copy: async () => {
      try {
        await navigator.clipboard.writeText(code);
      } catch (e) {
        console.error("Copy failed", e);
      }
    },
    download: () => {
      const nameToExt = { JavaScript: "js", Python: "py", "C++": "cpp", Java: "java" };
      const ext = nameToExt[language?.name || "JavaScript"] || "txt";
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solution.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    setLanguage: async (name) => {
      const matched = languageOptions.find((l) => l.name === name);
      const fetchedLessons = await getLessons(name.toLowerCase());
      if (matched) {
        router.push(`/questions/${matched.name.toLowerCase()}/${fetchedLessons[0]?.id}`);
      }
    },
    getState: () => ({ code, languageName: language?.name }),
    hamburgerToggle: () => {
      setIsHamburgerOpen((prev) => !prev);
      console.log(isHamburgerOpen);
    }
  }));

  /* ------------------------------- Drag Resizing ------------------------------- */
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const containerHeight = window.innerHeight * 0.9;
    const newHeight = (e.clientY / containerHeight) * 100;
    if (newHeight > 30 && newHeight < 90) setEditorHeight(newHeight);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => (isDragging.current = false));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => (isDragging.current = false));
    };
  }, []);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    // You can add logic here to load the question content into the ed
    // itor
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-[#1a1a1d] hidden-md right-90 top-40 z-40 fixed max-w-[400px] w-[300px]  text-white p-[5px] rounded-xl border border-gray-700 shadow-md space-y-2">
        <GoblinBox response={goblinLine} />
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          {!isLessonStarted ? (
            <button
              onClick={() => setIsLessonStarted(true)}
              className=" cursor-pointer flex-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-md transition"
            >
              Start Lesson
            </button>
          ) : (
            <div className="flex w-full items-center gap-2">
              <button
                onClick={() => setLessonStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={!goblinTeaching || lessonStepIndex === 0}
                className="cursor-pointer flex-1 px-2 py-1 bg-gray-700 disabled:opacity-40 rounded-md hover:bg-gray-600 transition"
                title="Previous line"
              >
                ← Prev
              </button>
              <button
                onClick={() => setLessonStepIndex((prev) => Math.min((goblinTeaching?.length || 1) - 1, prev + 1))}
                disabled={!goblinTeaching || lessonStepIndex >= (goblinTeaching?.length || 1) - 1}
                className="cursor-pointer flex-1 px-2 py-1 bg-gray-700 disabled:opacity-40 rounded-md hover:bg-gray-600 transition"
                title="Next line"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full h-full gap-4 ">
        {/* Sidebar */}
        <div
          className={`sidebar ${isHamburgerOpen ? "desktop-sidebar" : ""} bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d] border border-gray-700 rounded-2xl shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-80'
            }`}
        >
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
        `}</style>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] p-2 md-rounded-t-2xl border-b border-gray-700">
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">📚</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Lessons</h3>
                      <p className="text-gray-400 text-xs">{language?.name || 'All Languages'}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`w-8 h-8 ${isHamburgerOpen ? "hidden" : ""} bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors shadow-sm`}
                  title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <span className="text-gray-300 text-sm">
                    {isSidebarCollapsed ? '→' : '←'}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {!isSidebarCollapsed && (
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#2a2a2d] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {isLoadingLessons ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                  <span className="ml-3 text-gray-400 text-sm">Loading lessons...</span>
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📝</div>
                  <p className="text-gray-400 text-sm">
                    {searchTerm ? 'No lessons found' : 'No lessons available'}
                  </p>
                </div>
              ) : (
                filteredLessons.map((lesson) => (
                  <div key={lesson.id} className="space-y-1">
                    <button
                      onClick={() => { handleLessonClick(lesson); }}
                      className={`cursor-pointer select-none w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${openLessons[lesson.id]
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                        : 'bg-[#2a2a2d] hover:bg-[#3a3a3d] text-gray-200 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${openLessons[lesson.id] ? 'bg-white scale-125' : 'bg-gray-400'
                          }`}></div>
                        {!isSidebarCollapsed && (
                          <span className="font-medium text-sm truncate">{lesson.title}</span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <span onClick={(e) => {
                          e.stopPropagation();   // ⛔ prevent triggering button click
                          toggleLesson(lesson.id);
                        }} className={`select-none p-1 cursor-pointer text-xs transition-transform duration-200 ${openLessons[lesson.id] ? 'rotate-90' : ''}`}>
                          ▸
                        </span>
                      )}
                    </button>

                    {/* Questions Dropdown */}
                    {openLessons[lesson.id] && !isSidebarCollapsed && (
                      <div className="ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {isLoadingQuestions[lesson.id] ? (
                          <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                            <span className="ml-2 text-gray-400 text-xs">Loading...</span>
                          </div>
                        ) : lessonQuestions[lesson.id]?.length === 0 ? (
                          <div className="text-center py-2">
                            <p className="text-gray-500 text-xs">No questions available</p>
                          </div>
                        ) : (
                          lessonQuestions[lesson.id]?.map((question) => (
                            <button
                              key={question.id}
                              onClick={() => handleQuestionClick(question)}
                              className={`w-full text-left p-2 rounded-md transition-all duration-200 text-sm ${selectedQuestion?.id === question.id
                                ? 'bg-gray-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3d]'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs">•</span>
                                <span className="truncate">{question.question_text}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <div className="p-4 border-t border-gray-700">
                <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📊</span>
                      <span>Progress</span>
                    </div>
                    <span className="font-medium">
                      {lessons.length > 0 ? `0/${lessons.length}` : '0/0'}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                    <div className="bg-gray-500 h-1 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <motion.div
          key={currentLesson?.id || "no-lesson"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col gap-1"
        >
          <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700" style={{ height: `${editorHeight}%`, transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl flex items-center justify-between font-semibold text-gray-300 text-base shadow">
              <span>{"</> Code Editor"}</span>
              {language && <span className="text-sm text-gray-400">{language.name}</span>}
            </div>

            <div className="flex-1 p-2 overflow-hidden">
              {language && (
                <CodeMirror
                  value={code}
                  height="100%"
                  extensions={[language.langExt(), EditorView.lineWrapping]}
                  theme="dark"
                  onChange={(val) => setCode(val)}
                  basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
                  style={{
                    height: "100%",
                    fontFamily: "monospace",
                    backgroundColor: "#232526",
                    color: "#eee",
                    fontSize: "14px",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-end px-4 py-2 border-t border-gray-700 bg-[#232526] rounded-b-2xl">
              <button
                onClick={runCode}
                disabled={loading}
                className="px-4 py-1 bg-[#222222] text-[#28c244] rounded hover:bg-gray-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          <div
            className="h-[2px] cursor-ns-resize hover:bg-gray-400 transition flex items-center justify-center"
            onMouseDown={() => (isDragging.current = true)}
          >
            <div className="bg-gray-600 w-[2%] h-[80%] rounded-2xl"></div>
          </div>

          <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700" style={{ height: `${100 - editorHeight}%`, transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl flex items-center font-semibold text-gray-300 text-base shadow">
              {"</> Terminal"}
            </div>
            <div className="flex-1 p-4 hide-scrollbar font-mono text-sm text-gray-300 bg-[#232526] rounded-b-2xl overflow-auto">
              {output ? output : <span className="text-gray-500 ">you output will appear here...</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});
