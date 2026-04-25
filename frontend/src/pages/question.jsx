"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CodeEditorDynamic from "../components/CodeEditor.dynamic";
import { getLessonByLanguage } from "../services/lessonServices";
import { getQuestionByLesson } from "../services/questionServices";
import LazyCodeEditor from "../components/LazyCodeEditor";
import Navbar2 from "../components/Navbar2";
import { useAuth } from "../hooks/useAuth";

const Question = () => {
  const params = useParams();
  const navigate = useNavigate();
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
const { user, loading } = useAuth();
   
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
      const data = await getLessonByLanguage(language);
      setLessons(data);
    };
    fetchLessons();
  }, [language]);
  
useEffect(() => {
  if (loading) return; // WAIT until auth is resolved

  if (!user) {
      navigate("/auth/register");
    } else {
    setCurrentUser(user);
  }
}, [user, loading]);
  

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
        hamburgerToggle={() => editorRef.current && editorRef.current.hamburgerToggle()}
      />
      <div className="flex w-full h-[93vh] gap-2 p-2 md:p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="flex w-[100%] gap-1">
          {/* Main Code/Terminal Area */}
          <div
            className="bg-gradient-to-b w-[100%] from-[#232526] to-[#232526]/80 h-full rounded-2xl flex flex-col shadow-2xl border border-gray-700"
            
          >
            <CodeEditorDynamic
              ref={editorRef}
              initialLanguage={language}
              initialLesson={lesson}
              onLanguageChanged={(name) => setCurrentLanguage(name)}
            />
            
          </div>
        </div>

      </div>
    </>
  );
};

export default Question;
