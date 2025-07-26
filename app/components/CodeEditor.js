"use client";

import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { getLessons } from "@/app/services/getLessons";
import { getQuestion } from "@/app/services/getQuestions";
import { getGoblinLines } from "../services/getGoblinLines";
import GoblinBox from "./GoblinBox";
import { supabase } from "../utils/supabaseClient";

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript },
  { id: 71, name: "Python", langExt: python },
  { id: 54, name: "C++", langExt: cpp },
  { id: 62, name: "Java", langExt: java },
];

export default function CodeEditor({ initialLanguage, initialLesson }) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorHeight, setEditorHeight] = useState("60");
  const [language, setLanguage] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [openLessons, setOpenLessons] = useState([]);
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState({});
  const isDragging = useRef(false);
  const [goblinLines, setGoblinLines] = useState([])
  const [currentLesson, setCurrentLesson] = useState()
  const [hasInitialized, setHasInitialized] = useState(false);


  // set the goblin lines for current lesson
  useEffect(() => {
    const getlines = async () => {
      if (currentLesson) {
        const data = await getGoblinLines(currentLesson.id)
        setGoblinLines(data)
      }
    }

    getlines()
  }, [currentLesson])

  const handleLessonClick = async (lesson) => {
    setCurrentLesson(lesson);

    const commentPrefix = {
      JavaScript: "//",
      Python: "#",
      "C++": "//",
      Java: "//"
    };

    const langPrefix = commentPrefix[language?.name || "JavaScript"];
    const lessonComment = `${langPrefix} ${lesson.title}\n\n`;

    setCode(lessonComment); // overwrite or prepend to current code
  };

  // Fetch lessons for the current language
  useEffect(() => {
    if (!initialLanguage) return;
    const formattedLang =
      initialLanguage.charAt(0).toUpperCase() + initialLanguage.slice(1).toLowerCase();
    const matchedLang = languageOptions.find((l) => l.name === formattedLang);
    setLanguage(matchedLang || languageOptions[0]);

    // Fetch lessons for the current language
    const fetchLessons = async () => {
      setIsLoadingLessons(true);
      try {
        const data = await getLessons(initialLanguage);
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [initialLanguage]);

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
            "X-RapidAPI-Key": "0b1b9f6e3cmsh68207f8396df600p1dfeb2jsn02e4736b395c",
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
      o
    } catch (err) {
      setOutput(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const containerHeight = window.innerHeight * 0.9;
    const newEditorHeight = (e.clientY / containerHeight) * 100;
    if (newEditorHeight > 30 && newEditorHeight < 90) {
      setEditorHeight(newEditorHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => (isDragging.current = false));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => (isDragging.current = false));
    };
  }, []);

  const toggleLesson = async (lessonId) => {
    setOpenLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));

    if (!lessonQuestions[lessonId]) {
      setIsLoadingQuestions(prev => ({ ...prev, [lessonId]: true }));
      try {
        const questions = await getQuestion(lessonId);
        setLessonQuestions((prev) => ({
          ...prev,
          [lessonId]: questions,
        }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoadingQuestions(prev => ({ ...prev, [lessonId]: false }));
      }
    }
  };


useEffect(() => {
  const init = async () => {
    // Wait until both initialLesson and lessons are available
    if (!initialLesson || lessons.length === 0 || hasInitialized) return;

    const lesson = lessons.find((l) => l.title === initialLesson);
    if (!lesson) return;
   handleLessonClick(lesson)
    setCurrentLesson(lesson);

    setOpenLessons((prev) => ({
      ...prev,
      [lesson.id]: true,
    }));

    if (!lessonQuestions[lesson.id]) {
      const questions = await getQuestion(lesson.id);
      setLessonQuestions((prev) => ({
        ...prev,
        [lesson.id]: questions,
      }));
    }

    // Mark as initialized
    setHasInitialized(true);
  };

  init();
}, [initialLesson, lessons, hasInitialized]);

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
      {goblinLines.length != 0 &&
        <div className="bg-[#1a1a1d] right-90 top-40 z-40 fixed max-w-[400px] w-[300px]  text-white p-2 rounded-2xl border border-gray-700 shadow-md space-y-2">
          <GoblinBox lines={goblinLines} />
        </div>
      }
      <div className="flex w-full h-full gap-4">
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-[#1a1a1d] to-[#2a2a2d] border border-gray-700 rounded-2xl shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-80'
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-[#2a2a2d] to-[#3a3a3d] p-4 rounded-t-2xl border-b border-gray-700">
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
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors shadow-sm"
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
                      onClick={() => { toggleLesson(lesson.id); handleLessonClick(lesson); }}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${openLessons[lesson.id]
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
                        <span className={`text-xs transition-transform duration-200 ${openLessons[lesson.id] ? 'rotate-90' : ''
                          }`}>
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
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700" style={{ height: `${editorHeight}%` }}>
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

          <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700" style={{ height: `${100 - editorHeight}%` }}>
            <div className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl flex items-center font-semibold text-gray-300 text-base shadow">
              {"</> Terminal"}
            </div>
            <div className="flex-1 p-4 hide-scrollbar font-mono text-sm text-gray-300 bg-[#232526] rounded-b-2xl overflow-auto">
              <pre>{output || "$ Output will appear here..."}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
