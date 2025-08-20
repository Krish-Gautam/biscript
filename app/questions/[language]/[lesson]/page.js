"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar2 from "@/app/components/Navbar2";
import Image from "next/image";
import CodeEditor from "@/app/components/CodeEditor";
import { getLessons } from "@/app/services/getLessons";
import { getQuestion } from "@/app/services/getQuestions";


const Page = () => {
  const params = useParams();
  const router = useRouter();
  const lesson = params.lesson
  const language = params.language;
  const [currentLessons, setCurrentLesson] = useState(params.lesson);
  const [lessons, setLessons] = useState([]);
  const [editorProblem, setEditorProblem] = useState("20");
  const isDragging = useRef(false);
  const [openLessons, setOpenLessons] = useState({});
  const [lessonQuestions, setLessonQuestions] = useState({});
  const editorRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
   
  // Resize Panel
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const containerWidth = window.innerWidth * 0.8;
      const newWidth = (e.clientX / containerWidth) * 100;
      if (newWidth > 1 && newWidth < 70) setEditorProblem(newWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Fetch Lessons
  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessons(language);
      setLessons(data);
    };
    fetchLessons();
  }, [language]);
  
  
  // Toggle dropdown + fetch questions if needed
  const toggleLesson = async (lessonId) => {
    setOpenLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));

    if (!lessonQuestions[lessonId]) {
      const questions = await getQuestion(lessonId);
      setLessonQuestions((prev) => ({
        ...prev,
        [lessonId]: questions,
      }));
    }
  };
  // Handle question click
  const handleQuestionClick = (lessonId, questionTitle) => {
    const slug = questionTitle.toLowerCase().replace(/\s+/g, "-");
    if (lessonId === currentLessons) {
      console.log("Same lesson, load question:", slug);
      // Optional: update state here if needed
    } else {
      router.push(`/questions/${language}/${lessonId}`);
    }
  };

  return (
    <>
      <Navbar2
        title={`Lesson ${lesson.title}`}
        difficulty={""}
        onRun={async () => {
          if (!editorRef.current) return;
          setIsRunning(true);
          await editorRef.current.run();
          setIsRunning(false);
        }}
        onReset={() => editorRef.current && editorRef.current.reset()}
        onCopy={() => editorRef.current && editorRef.current.copy()}
        onDownload={() => editorRef.current && editorRef.current.download()}
        currentLanguage={currentLanguage}
        onLanguageChange={(name) => editorRef.current && editorRef.current.setLanguage(name)}
        isRunning={isRunning}
      />
      <div className="flex w-full h-[93vh] gap-2 p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="flex w-[100%] gap-1">
          {/* Main Code/Terminal Area */}
          <div
            className="bg-gradient-to-b w-[100%] from-[#232526] to-[#232526]/80 h-full rounded-2xl flex flex-col gap-4 shadow-2xl border border-gray-700"
            
          >
            <CodeEditor
              ref={editorRef}
              initialLanguage={language}
              initialLesson={lesson}
              onLanguageChanged={(name) => setCurrentLanguage(name)}
            />
            
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gradient-to-b from-[#232526] to-[#414345] h-full w-[20%] rounded-2xl p-4 flex flex-col shadow-xl border border-gray-700 relative">
          <div className="flex-1" />
          <input
            className="bg-[#232526] p-3 rounded-xl w-full border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 ring-blue-500 transition shadow-inner"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
    </>
  );
};

export default Page;
