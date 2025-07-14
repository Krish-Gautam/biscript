"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python"; // Import Python language support
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { useRef } from "react";
import { useEffect } from "react";

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript },
  { id: 71, name: "Python", langExt: python }, // Replace with correct lang if needed
  { id: 54, name: "C++", langExt: cpp }, // Replace with correct lang if needed
  { id: 62, name: "Java", langExt: java }, // Replace with correct lang if needed
];

export default function CodeEditor() {
  const [language, setLanguage] = useState(languageOptions[0]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorHeight, setEditorHeight] = useState("60");
  const isDragging = useRef(false);

  useEffect(() => {
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, []);


  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");
    try {
      const res = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key":
              "0b1b9f6e3cmsh68207f8396df600p1dfeb2jsn02e4736b395c",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: language.id,
          }),
        }
      );

      const result = await res.json();
      setOutput(result.stdout || result.stderr || "No output");
    } catch (err) {
      setOutput("Error running code.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const containerHeight = window.innerHeight * 0.9;
    const newEditorHeight = (e.clientY / containerHeight) * 100;

    if (newEditorHeight > 30 && newEditorHeight < 90) {
      setEditorHeight(newEditorHeight);
    }
  };

    if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <div className="flex flex-col gap-1 w-full h-[90vh]">
      {/* Editor */}
      <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 "
           style={{ height: `${editorHeight}%` }}>
        <div className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl flex items-center font-semibold text-blue-400 text-base shadow">
          {"</> Code Editor"}
        </div>

        <div className="flex-1 p-4 overflow-hidden">
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
        </div>

        <div className="flex items-center justify-end px-4 py-2 border-t border-gray-700 bg-[#232526] rounded-b-2xl">
          <div className="flex items-end  gap-2">
            <button
              onClick={runCode}
              disabled={loading}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
            <select
              className="p-2 h-[32px] rounded bg-[#2e2e2e] text-white"
              value={language.id}
              onChange={(e) =>
                setLanguage(
                  languageOptions.find(
                    (l) => l.id === Number(e.target.value)
                  ) || languageOptions[0]
                )
              }
            >
              {languageOptions.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div  className="h-[2px] cursor-ns-resize  hover:bg-gray-400 transition flex items-center justify-center"
        onMouseDown={handleMouseDown}>
          <div className="bg-gray-600 w-[2%] h-[80%] rounded-2xl"></div>
        </div>

      {/* Terminal */}
      <div className="flex flex-col bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 " style={{ height: `${100 - editorHeight}%` }}>
        <div className="bg-gradient-to-r from-[#333333] to-[#232526] h-10 px-4 rounded-t-2xl flex items-center font-semibold text-green-400 text-base shadow">
          {"</> Terminal"}
        </div>
        <div className="flex-1 p-4 font-mono text-sm text-gray-300 bg-[#232526] rounded-b-2xl overflow-auto">
          <pre>{output || "$ Output will appear here..."}</pre>
        </div>
      </div>
    </div>
  );
}