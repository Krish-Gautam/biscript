"use client";
import React, { use } from "react";
import Navbar2 from "../../components/Navbar2";
import Image from "next/image";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import CodeEditor from "@/app/components/CodeEditor";

const page = () => {
  const problems = [
    { id: 1, title: "Two Sum" },
    { id: 2, title: "Reverse Linked List" },
    { id: 3, title: "Valid Parentheses" },
  ];

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [editorProblem, setEditorProblem] = useState("20");
  const isDragging = useRef(false);


  const handleMouseDown = (e) => {
    isDragging.current = true;
  }

 useEffect(() => {
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const containerWidth = window.innerWidth * 0.8; // if container is 80% width
    const newWidth = (e.clientX / containerWidth) * 100;

    if (newWidth > 1 && newWidth < 70) {
      setEditorProblem(newWidth);
    }
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




  return (
    <>
      <Navbar2 />
      <div className="flex w-full h-[93vh] gap-2 p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="flex w-[80%] gap-1 ">
          {/* Sidebar */}
        <div className="bg-gradient-to-b overflow-y-auto flex-basis  from-[#232526] to-[#414345] h-[100%]  rounded-2xl flex flex-col  p-4 shadow-xl border border-gray-700"
        style={{ width: `${editorProblem}%` }}>
          <div className="flex flex-col h-full min-w-[200px] gap-2">
            <div className="bg-[#333333] h-10 px-4 rounded-xl flex items-center font-semibold text-gray-200 text-lg tracking-wide shadow-sm">
            Problem List
          </div>

          <div className="bg-[#232526] rounded-2xl h-10 w-full flex items-center px-3 gap-2 shadow-inner focus-within:ring-2 ring-blue-500 transition">
            <Image src="/search.svg" alt="" width={20} height={20} />
            <input
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400"
              type="text"
              placeholder="Search problems..."
            />
          </div>

          <div className="flex flex-col gap-2  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-[#333333] h-10 px-4 rounded-xl flex items-center text-gray-200 font-medium cursor-pointer hover:bg-blue-600 hover:text-white transition shadow-sm"
              >
                {problem.title}
              </div>
            ))}
          </div>
          </div>
        </div>

        <div  className="w-[3px] cursor-ew-resize  hover:bg-gray-400 transition flex items-center justify-center"
        onMouseDown={handleMouseDown}>
          <div className="bg-gray-600 h-[4%] w-[80%] rounded-2xl"></div>
        </div>


        {/* Main Code/Terminal Area */}
        <div className="bg-gradient-to-b  from-[#232526] to-[#232526]/80 h-[100%]  rounded-2xl flex flex-col gap-4 shadow-2xl border border-gray-700"
        style={{ width: `${100-editorProblem}%` }}>
          {/* Code Editor */}
          <CodeEditor />

          
        </div>
        </div>



        {/* Right Panel */}
        <div className="bg-gradient-to-b from-[#232526] to-[#414345] h-[100%] w-[20%] rounded-2xl p-4 flex flex-col shadow-xl border border-gray-700 relative">
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

export default page;
