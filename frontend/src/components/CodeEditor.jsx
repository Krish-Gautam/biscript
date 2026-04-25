"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { getLessonByLanguage } from "../services/lessonServices";
import { getQuestionByLesson } from "../services/questionServices";
import { getGoblinScript } from "../services/goblinLineServices";
import GoblinBox from "./GoblinBox";
import AIInLineChat from "./AIInlineChat";
import { deserializePlan } from "../services/deserializePlan/deserializePlan";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import livechat from "../assets/livechat.png";

/* ---------------------------------- Setup ---------------------------------- */

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript },
  { id: 71, name: "Python", langExt: python },
  { id: 54, name: "C++", langExt: cpp },
  { id: 62, name: "Java", langExt: java },
];

const commentPrefix = {
  JavaScript: "//",
  Python: "#",
  "C++": "//",
  Java: "//",
};

// Single source of truth for panel width — used for editor margin and goblin boundary
const AI_PANEL_WIDTH = 368;

/* =============================== MAIN COMPONENT =============================== */

export default forwardRef(function CodeEditor(
  { initialLanguage, initialLesson, onLanguageChanged },
  ref,
) {
  /* ------------------------------- State ------------------------------- */
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorHeight, setEditorHeight] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [language, setLanguage] = useState(null);
  const [canCheckInput, setCanCheckInput] = useState(false);
  const [lastReaction, setLastReaction] = useState(null);
  const [stepMessageShown, setStepMessageShown] = useState(false);
  const navigate = useNavigate();

  // Sidebar & Lessons
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [openLessons, setOpenLessons] = useState({});
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState({});

  // Goblin
  const [goblinLine, setGoblinLine] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [goblinTeaching, setGoblinTeaching] = useState(null);
  const [lessonStepIndex, setLessonStepIndex] = useState(0);
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const goblinElRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // chatMounted keeps AIInLineChat alive during the close animation so it
  // doesn't visually pop out before the slide finishes
  const [chatMounted, setChatMounted] = useState(false);
  useEffect(() => {
    if (isChatOpen) {
      setChatMounted(true);
    } else {
      const t = setTimeout(() => setChatMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [isChatOpen]);

  // User progress
  const [userProfile, setUserProfile] = useState({
    name: "Anonymous Toad",
    mistakes: [],
    completedLessons: [],
    goblinMood: "neutral",
  });

  // Refs
  const autoAdvanceTimeoutRef = useRef(null);
  const checkInputTimeoutRef = useRef(null);
  const editorContainerRef = useRef(null);

  /* ------------------------------- Goblin position ------------------------------- */
  // Goblin's max-x shrinks by the panel width when chat is open so it
  // never gets stuck behind the panel
  const goblinMaxX = useCallback(
    () => window.innerWidth - 320 - (isChatOpen ? AI_PANEL_WIDTH + 46 : 0),
    [isChatOpen],
  );

  const [pos, setPos] = useState(() => ({
    x:
      typeof window !== "undefined"
        ? Math.max(0, window.innerWidth - 540)
        : 800,
    y: 100,
  }));

  // Nudge goblin into safe zone whenever the panel opens or closes
  useEffect(() => {
    setPos((prev) => ({ ...prev, x: Math.min(prev.x, goblinMaxX()) }));
  }, [isChatOpen, goblinMaxX]);

  /* ------------------------------- Initialization ------------------------------- */
  useEffect(() => {
    if (!initialLanguage) return;
    const formattedLang =
      initialLanguage.charAt(0).toUpperCase() +
      initialLanguage.slice(1).toLowerCase();
    const matchedLang = languageOptions.find((l) => l.name === formattedLang);
    setLanguage(matchedLang || languageOptions[0]);
    if (onLanguageChanged)
      onLanguageChanged((matchedLang || languageOptions[0]).name);

    const fetchLessons = async () => {
      setIsLoadingLessons(true);
      try {
        const response = await getLessonByLanguage(initialLanguage);
        const sortedLessons = [...response.data].sort(
          (a, b) => a.lesson_number - b.lesson_number,
        );
        setLessons(sortedLessons);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [initialLanguage, onLanguageChanged]);

  useEffect(() => {
    if (!initialLesson || lessons.length === 0 || !language) return;
    const lesson = lessons.find((l) => l._id === initialLesson);
    if (!lesson) return;

    const init = async () => {
      setCurrentLesson(lesson);
      setOpenLessons((prev) => ({ ...prev, [lesson._id]: true }));
      setCode(`${commentPrefix[language.name] ?? "//"} ${lesson.title}\n\n`);
      if (!lessonQuestions[lesson._id]) {
        const res = await getQuestionByLesson(lesson._id);
        setLessonQuestions((prev) => ({ ...prev, [lesson._id]: res.data }));
      }
      resetTeachingFlow();
    };
    init();
  }, [initialLesson, lessons, language]);

  useEffect(() => {
    if (!currentLesson) return;
    const fetchGoblinTeaching = async () => {
      const { data } = await getGoblinScript(currentLesson._id);
      if (data?.length > 0)
        setGoblinTeaching(deserializePlan(data[0].plan || []));
    };
    fetchGoblinTeaching();
  }, [currentLesson]);

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

  useEffect(() => {
    const step = goblinTeaching?.[lessonStepIndex];
    if (!step || !isLessonStarted) return;
    clearTimers();
    setGoblinLine(step.message);
    setCurrentEmoji(step.emoji);
    setLastReaction(null);
    setStepMessageShown(true);
    setCanCheckInput(false);
    if (!step.waitFor) {
      const t = Math.min(Math.max(step.message.length * 90, 5000), 12000);
      autoAdvanceTimeoutRef.current = setTimeout(
        () => setLessonStepIndex((p) => p + 1),
        t,
      );
    } else {
      checkInputTimeoutRef.current = setTimeout(
        () => setCanCheckInput(true),
        8000,
      );
    }
    return clearTimers;
  }, [lessonStepIndex, goblinTeaching, isLessonStarted]);

  useEffect(() => {
    const step = goblinTeaching?.[lessonStepIndex];
    if (!step?.waitFor || !canCheckInput || !isLessonStarted) return;
    if (step.waitFor(code, output)) {
      setLessonStepIndex((p) => p + 1);
      setStepMessageShown(false);
      setLastReaction(null);
      return;
    }
    if (step.reactions?.length) {
      const matched = step.reactions.find((r) => r.trigger(code, output));
      if (matched && matched !== lastReaction) {
        setGoblinLine(matched.response);
        setLastReaction(matched);
        setStepMessageShown(false);
        setUserProfile((prev) => ({
          ...prev,
          mistakes: [...prev.mistakes, { step: step.trigger, code }],
        }));
      }
    }
  }, [
    code,
    output,
    goblinTeaching,
    lessonStepIndex,
    canCheckInput,
    isLessonStarted,
    lastReaction,
  ]);

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!isChatOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isChatOpen]);

  /* ------------------------------- Goblin Drag ------------------------------- */
  const posRef = useRef(pos);
  const frameRef = useRef(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const onGoblinMouseDown = useCallback(
    (e) => {
      if (!e.target.closest("[data-drag-handle]")) return;

      e.preventDefault();
      draggingRef.current = true;

      const offset = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y,
      };

      const updatePosition = (x, y) => {
        const newPos = {
          x: Math.max(0, Math.min(goblinMaxX(), x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, y)),
        };

        posRef.current = newPos;

        // Only update DOM directly (no React render)
        if (goblinElRef.current) {
          goblinElRef.current.style.transform = `translate3d(${newPos.x}px, ${newPos.y}px, 0)`;
        }
      };

      const onMove = (ev) => {
        if (!draggingRef.current) return;

        if (frameRef.current) cancelAnimationFrame(frameRef.current);

        frameRef.current = requestAnimationFrame(() => {
          updatePosition(ev.clientX - offset.x, ev.clientY - offset.y);
        });
      };

      const onUp = () => {
        draggingRef.current = false;

        // Sync final position to React state ONCE
        setPos(posRef.current);

        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [goblinMaxX],
  );

  /* ------------------------------- Vertical Resize ------------------------------- */
  const onDividerMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = editorHeight;
      setIsResizing(true);
      const onMove = (ev) => {
        if (!editorContainerRef.current) return;
        const delta =
          ((ev.clientY - startY) / editorContainerRef.current.clientHeight) *
          100;
        setEditorHeight(Math.min(85, Math.max(15, startH + delta)));
      };
      const onUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [editorHeight],
  );

  /* ------------------------------- Lesson Handlers ------------------------------- */
  const handleLessonClick = (lesson) =>
    navigate(`/questions/${initialLanguage}/${lesson._id}`);

  const toggleLesson = async (lessonId) => {
    setOpenLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
    if (!lessonQuestions[lessonId]) {
      setIsLoadingQuestions((prev) => ({ ...prev, [lessonId]: true }));
      const res = await getQuestionByLesson(lessonId);
      setLessonQuestions((prev) => ({ ...prev, [lessonId]: res.data }));
      setIsLoadingQuestions((prev) => ({ ...prev, [lessonId]: false }));
    }
  };

  const resetTeachingFlow = () => {
    clearTimers();
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
      const res = await fetch(`${API_BASE_URL}/api/runCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code, language_id: language.id }),
      });
      const result = await res.json();
      console.log("Execution result:", result);
      setOutput(result.stdout || result.stderr || "No output");
    } catch (err) {
      setOutput(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    run: runCode,
    reset: () => {
      const t =
        currentLesson?.title || (initialLesson ? String(initialLesson) : "");
      setCode(`${commentPrefix[language?.name ?? "JavaScript"]} ${t}\n\n`);
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
      const ext =
        { JavaScript: "js", Python: "py", "C++": "cpp", Java: "java" }[
          language?.name ?? "JavaScript"
        ] || "txt";
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
      const res = await getLessonByLanguage(name.toLowerCase());
      if (matched)
        navigate(
          `/questions/${matched.name.toLowerCase()}/${res.data[0]?._id}`,
        );
    },
    getState: () => ({ code, languageName: language?.name }),
    hamburgerToggle: () => setIsHamburgerOpen((p) => !p),
  }));

  const handleQuestionClick = (q) => setSelectedQuestion(q);
  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================================= RENDER ================================= */
  return (
    <>
      {/* ── Goblin Box ─────────────────────────────────────────────────────── */}
      <div
        ref={goblinElRef}
        onMouseDown={onGoblinMouseDown}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          willChange: "transform",
          transition: draggingRef.current
            ? "none"
            : "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
        className="fixed z-[60] max-w-[400px] w-[300px] text-white  select-none relative"
      >

        {/* ❌ CONTENT */}
        <div data-drag-handle style={{ cursor: "default" }}>
          <GoblinBox
            response={goblinLine}
            emoji={currentEmoji}
            isLessonStarted={isLessonStarted}
            canGoPrev={lessonStepIndex > 0}
            canGoNext={
              goblinTeaching && lessonStepIndex < goblinTeaching.length - 1
            }
            onStart={() => setIsLessonStarted(true)}
            onPrev={() => setLessonStepIndex((p) => Math.max(0, p - 1))}
            onNext={() =>
              setLessonStepIndex((p) =>
                Math.min((goblinTeaching?.length || 1) - 1, p + 1),
              )
            }
          />
        </div>
      </div>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="relative flex w-full h-full gap-2 overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div
          className={[
            "sidebar",
            isHamburgerOpen ? "desktop-sidebar" : "",
            "bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d]",
            "border border-gray-700 rounded-2xl shadow-xl flex-shrink-0",
            "transition-all duration-300",
            isSidebarCollapsed ? "w-16" : "w-80",
          ].join(" ")}
        >
          <style>{`
            @media (max-width: 768px) { .sidebar { display: none !important; } }
            .desktop-sidebar {
              display: block !important;
              position: absolute;
              left: 0; top: 0; height: 100%;
              z-index: 999;
              animation: sidebar-slide-in 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes sidebar-slide-in {
              from { opacity: 0; transform: translateX(-40px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] p-2 rounded-t-2xl border-b border-gray-700">
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">📚</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Lessons
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {language?.name || "All Languages"}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed((p) => !p)}
                  className={`w-8 h-8 ${isHamburgerOpen ? "hidden" : ""} bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors`}
                  title={
                    isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  <span className="text-gray-300 text-sm">
                    {isSidebarCollapsed ? "→" : "←"}
                  </span>
                </button>
              </div>
            </div>

            {/* Search */}
            {!isSidebarCollapsed && (
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#2a2a2d] border border-gray-600 rounded-lg px-4 py-2
                               text-white placeholder-gray-400 focus:outline-none
                               focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>
            )}

            {/* Lessons list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {isLoadingLessons ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
                  <span className="ml-3 text-gray-400 text-sm">
                    Loading lessons...
                  </span>
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📝</div>
                  <p className="text-gray-400 text-sm">
                    {searchTerm ? "No lessons found" : "No lessons available"}
                  </p>
                </div>
              ) : (
                filteredLessons.map((lesson) => (
                  <div key={lesson._id} className="space-y-1">
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      className={`cursor-pointer select-none w-full text-left p-3 rounded-lg
                                  transition-all duration-200 flex items-center justify-between
                                  ${
                                    openLessons[lesson._id]
                                      ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg"
                                      : "bg-[#2a2a2d] hover:bg-[#3a3a3d] text-gray-200 hover:text-white"
                                  }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${openLessons[lesson._id] ? "bg-white scale-125" : "bg-gray-400"}`}
                        />
                        {!isSidebarCollapsed && (
                          <span className="font-medium text-sm truncate">
                            {lesson.title}
                          </span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLesson(lesson._id);
                          }}
                          className={`select-none p-1 cursor-pointer text-xs transition-transform duration-200 ${openLessons[lesson._id] ? "rotate-90" : ""}`}
                        >
                          ▸
                        </span>
                      )}
                    </button>

                    {openLessons[lesson._id] && !isSidebarCollapsed && (
                      <div className="ml-6 space-y-1">
                        {isLoadingQuestions[lesson._id] ? (
                          <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                            <span className="ml-2 text-gray-400 text-xs">
                              Loading...
                            </span>
                          </div>
                        ) : !lessonQuestions[lesson._id]?.length ? (
                          <p className="text-gray-500 text-xs text-center py-2">
                            No questions available
                          </p>
                        ) : (
                          lessonQuestions[lesson._id].map((question) => (
                            <button
                              key={question._id}
                              onClick={() => handleQuestionClick(question)}
                              className={`w-full text-left p-2 rounded-md transition-all duration-200 text-sm
                                          ${
                                            selectedQuestion?._id ===
                                            question._id
                                              ? "bg-gray-600 text-white shadow-md"
                                              : "text-gray-400 hover:text-white hover:bg-[#3a3a3d]"
                                          }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs">•</span>
                                <span className="truncate">
                                  {question.title}
                                </span>
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

            {/* Footer */}
            {!isSidebarCollapsed && (
              <div className="p-4 border-t border-gray-700">
                <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] rounded-lg p-3">
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📊</span>
                      <span>Progress</span>
                    </div>
                    <span className="font-medium">
                      {lessons.length > 0 ? `0/${lessons.length}` : "0/0"}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gray-500 h-1 rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Editor + Terminal ──────────────────────────────────────────────
            marginRight is animated to AI_PANEL_WIDTH+8 when chat opens.
            This "pushes" the editor column left in sync with the panel sliding
            in from the right — creating a smooth push effect with no black gap.
            The panel itself is position:absolute so it overlays the right edge.
        ──────────────────────────────────────────────────────────────────── */}
        <motion.div
          key={currentLesson?._id || "no-lesson"}
          ref={editorContainerRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            marginRight: isChatOpen ? AI_PANEL_WIDTH + 8 : 0,
            // No margin transition while resizing to avoid jank
            transition: isResizing
              ? "none"
              : "margin-right 480ms cubic-bezier(0.22,1,0.36,1)",
          }}
          className="flex-1 flex flex-col gap-1 min-w-0"
        >
          {/* Editor Panel */}
          <div
            className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700"
            style={{
              height: `${editorHeight}%`,
              transition: isResizing
                ? "none"
                : "height 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div
              className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl
                            flex items-center justify-between font-semibold text-gray-300 text-base"
            >
              <span>{"</> Code Editor"}</span>
              <div className="flex items-center gap-2">
                {language && (
                  <span className="text-sm text-gray-400">{language.name}</span>
                )}
                <button
                  onClick={() => setIsChatOpen((v) => !v)}
                  title="Toggle AI Chat"
                  aria-pressed={isChatOpen}
                  className={`w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center
                              transition-colors text-gray-200
                              ${isChatOpen ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  <img src={livechat} alt="Chat" width={16} height={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-2 overflow-hidden">
              {language && (
                <CodeMirror
                  value={code}
                  height="100%"
                  extensions={[language.langExt(), EditorView.lineWrapping]}
                  theme="dark"
                  onChange={(val) => setCode(val)}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: true,
                  }}
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

            <div className="flex  items-center justify-end px-4 py-2 border-t border-gray-700 bg-[#232526] rounded-b-2xl">
              <button
                onClick={runCode}
                disabled={loading}
                className="px-4 py-1 cursor-pointer bg-[#222222] text-[#28c244] rounded hover:bg-gray-700
                           transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          {/* Resize Divider */}
          <div
            className="h-[6px] cursor-ns-resize hover:bg-gray-500/40 transition flex items-center justify-center rounded"
            onMouseDown={onDividerMouseDown}
          >
            <div className="bg-gray-600 w-[8%] h-[3px] rounded-2xl" />
          </div>

          {/* Terminal Panel */}
          <div
            className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700"
            style={{
              height: `${100 - editorHeight}%`,
              transition: isResizing
                ? "none"
                : "height 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div
              className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl
                            flex items-center font-semibold text-gray-300 text-base"
            >
              {"</> Terminal"}
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-gray-300 bg-[#232526] rounded-b-2xl overflow-auto">
              {output ? (
                output
              ) : (
                <span className="text-gray-500">
                  your output will appear here...
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── AI Chat Panel ──────────────────────────────────────────────────
            • position:absolute right-0 — overlays the right edge, zero layout impact
            • translateX slides it fully off-screen to the right when closed
            • pointer-events:none when closed — zero click interference
            • visibility:hidden after animation completes — removed from a11y tree
            • chatMounted keeps children alive during the 500ms close animation
        ──────────────────────────────────────────────────────────────────── */}
        <div
          aria-hidden={!isChatOpen}
          className="absolute right-0 top-0 h-full z-50
                     bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d]
                     border border-gray-700 rounded-2xl"
          style={{
            width: AI_PANEL_WIDTH,
            transform: isChatOpen
              ? "translateX(0)"
              : `translateX(${AI_PANEL_WIDTH + 8}px)`,
            opacity: isChatOpen ? 1 : 0,
            pointerEvents: isChatOpen ? "auto" : "none",
            visibility: chatMounted ? "visible" : "hidden",
            transition:
              "transform 480ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease",
          }}
        >
          {chatMounted && <AIInLineChat onClose={() => setIsChatOpen(false)} />}
        </div>
      </div>
    </>
  );
});
