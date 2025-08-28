'use client'
import React, { use, useState } from 'react'
import Link from 'next/link'
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { EditorView } from "@codemirror/view"
import { useEffect } from 'react'
import { getChallengeData } from '@/app/services/getChallengeData'
import { getTestCases } from '@/app/services/getTestCases'
import { supabase } from '@/app/utils/supabaseClient'
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript },
  { id: 71, name: "Python", langExt: python },
  { id: 54, name: "C++", langExt: cpp },
  { id: 62, name: "Java", langExt: java },
];
export default function CodingPage({ params }) {
  const [selectedCase, setSelectedCase] = useState(0);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  // const { challengeId } = useParams()
  const [code, setCode] = useState('# Write your Python code here\n\n')
  const [output, setOutput] = useState('')
  const [results, setResults] = useState([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [panelWidth, setPanelWidth] = useState(30) // percent
  const sliderRef = React.useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [question, setQuestion] = useState(null)
  const [language, setLanguage] = useState({ id: 71, name: "Python", langExt: python }) // Default to Python 3
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [testCases, setTestCases] = useState([])
  const challengeId = params.id


  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (challengeId) {
      setIsLoadingContent(true);
      const fetchData = async () => {
        const challengedata = await getChallengeData(challengeId)
        setQuestion(challengedata[0])
        const testdata = await getTestCases(challengeId)
        setTestCases(testdata)
        setIsLoadingContent(false);
      }
      fetchData()
    }
  }, [challengeId])

  // useEffect(()=> {
  //   const fetchTestCases = async () => {
  //     const { data, error } = await getChallengeData(challengeId);
  //     if (error) {
  //       console.error("Error fetching test cases:", error);
  //     }
  //   };
  //   fetchTestCases();
  // }, [challengeId])

  const runCode = async () => {
    if (!language) return;
    setLoading(true);
    setOutput("Running...");

    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          source_code: code,
          language_id: language.id,
          userId: session?.user?.id
        })
      });

      if (!res.ok) {
        // Try to read JSON if possible, otherwise plain text
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();

      setResults(data.results || [])
      setOutput("")
      // Animate reveal of each test case result
      setRevealedCount(0)
      if (data.results && data.results.length > 0) {
        let i = 0;
        const revealNext = () => {
          setRevealedCount(i + 1)
          i++;
          if (i < data.results.length) {
            setTimeout(revealNext, 400)
          }
        }
        setTimeout(revealNext, 400)
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Question Not Found</h1>
          <Link href="/challenges" className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl transition-colors border border-white/10">
            Back to Challenges
          </Link>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-neutral-950 relative animate-fade-in">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900/80 backdrop-blur-lg border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/challenges/question/${challengeId}`} className="text-blue-400 hover:text-blue-300 transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">Challenge - {question.title}</h1>
            </div>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm border border-white/20">
              {question.category}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Question Panel */}
          <div className="bg-neutral-900/60 backdrop-blur-sm border-r border-white/10 overflow-y-auto hide-scrollbar" style={{ width: `${panelWidth}%` }}>
            <div className="p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4" tabIndex="0">Problem Statement</h2>
              <div className="bg-neutral-800/50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                {isLoadingContent ? (
                  <div className="animate-pulse h-6 w-3/4 bg-gray-700 rounded mb-2" aria-label="Loading problem statement"></div>
                ) : (
                  <p className="text-gray-200 leading-relaxed animate-fade-in" tabIndex="0">
                    {question.description}
                  </p>
                )}
              </div>

              {/* Hints Section - Only for Easy and Medium */}
              {(question.category === 'Easy' || question.category === 'Medium') && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors mb-4 border border-yellow-500/30"
                  >
                    {showHints ? 'Hide Hints' : 'Show Hints'} 💡
                  </button>

                  {showHints && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-400 mb-2">Hints:</h3>
                      <div className="text-yellow-300 space-y-2">
                        {question.hints ? (
                          question.hints.map((hint, index) => (
                            <p key={index} className="flex items-start">
                              <span className="font-bold mr-2">{index + 1}.</span>
                              {hint}
                            </p>
                          ))
                        ) : (
                          <div>
                            <p>• Break down the problem into smaller steps</p>
                            <p>• Think about what data structures you might need</p>
                            <p>• Consider edge cases and input validation</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Example Input/Output */}
              {testCases.length !== 0 && testCases.map((testCases, index) => (
                <div key={index} className="space-y-4">
                  <div className="font-semibold text-gray-200 mb-2">Example {index + 1}:</div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <h3 className="font-semibold  text-gray-200 mb-2">Input : {
                      <code className="text-lg text-gray-300">
                        {testCases.input || "// Add example input in your question data"}
                      </code>
                    }</h3>

                    <h3 className="font-semibold text-gray-200 mb-2">Output : {
                      <code className="text-lg text-gray-300">
                        {testCases.output || "// Add expected output in your question data"}
                      </code>
                    }</h3>

                  </div>


                </div>
              )

              )}
            </div>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="group flex items-center justify-center"
            style={{
              
              top: 0,
              left: `${panelWidth}%`,
              width: "6px", // wider invisible area for grabbing
              height: "100%",
              cursor: "col-resize",
              zIndex: 50,
              background: "gray", // no background, only dots visible
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = panelWidth;
              function onMouseMove(ev) {
                const dx = ev.clientX - startX;
                const newWidth = Math.min(
                  80,
                  Math.max(20, startWidth + (dx * 100) / window.innerWidth)
                );
                setPanelWidth(newWidth);
              }
              function onMouseUp() {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              }
              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
          >
            {/* Grip dots */}
            <div className="flex flex-col items-center gap-[4px] bg-transparent z-[100]">
              <div className="w-[6px] h-[6px] rounded-full bg-gray-700 shadow-md"></div>
              <div className="w-[6px] h-[6px] rounded-full bg-gray-700 shadow-md"></div>
              <div className="w-[6px] h-[6px] rounded-full bg-gray-700 shadow-md"></div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="flex flex-col" style={{ width: `${100 - panelWidth}%` }}>
            {/* Editor Header */}
            <div className="bg-neutral-800 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-white">Code Editor</span>
                <select
                  value={language.id}
                  onChange={e => {
                    const selected = languageOptions.find(l => l.id === Number(e.target.value));
                    setLanguage(selected);
                    // Optionally reset code for new language
                    setCode(selected.name === "Python" ? '# Write your Python code here\n\n' : selected.name === "JavaScript" ? '// Write your JavaScript code here\n\n' : selected.name === "C++" ? '// Write your C++ code here\n\n' : '// Write your Java code here\n\n');
                  }}
                  className="bg-neutral-900 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-sm shadow hover:bg-neutral-800"
                  style={{ minWidth: 120 }}
                  aria-label="Select language"
                >
                  {languageOptions.map(opt => (
                    <option key={opt.id} value={opt.id} className="bg-neutral-900 text-white">
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Running...
                  </>
                ) : (
                  <>
                    ▶ Run Code
                  </>
                )}
              </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1 bg-neutral-900">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[python(), EditorView.lineWrapping]}
                theme="dark"
                onChange={(val) => setCode(val)}
                basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
                style={{
                  height: "100%",
                  fontFamily: "monospace",
                  backgroundColor: "#1a1a1a",
                  color: "#eee",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="h-48 bg-black text-green-400 p-4 overflow-y-auto font-mono text-sm border-t border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold animate-fade-in">Test Cases:</span>
                {loading && (
                  <span className="ml-2 animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></span>
                )}
              </div>
                <div className="flex gap-2 mb-4">
                  {testCases.length > 0 ? (
                    testCases.map((tc, idx) => {
                      const res = results[idx];
                      let icon = <span className="text-gray-400">⏺</span>;
                      if (res && idx < revealedCount) {
                        icon = res.passed ? <span className="text-green-400">✔️</span> : <span className="text-red-400">❌</span>;
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedCase(idx)}
                          className={`cursor-pointer select-none px-3 py-1 rounded bg-neutral-800 text-white text-xs font-semibold border border-gray-700 focus:outline-none transition-all ${selectedCase === idx ? 'ring-2 ring-blue-400' : ''}`}
                          aria-label={`Select Case ${idx + 1}`}
                        >
                          {icon} Case {idx + 1}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-gray-400">No test cases found.</span>
                  )}
                </div>
                {/* Details for selected case only */}
                {testCases[selectedCase] && (
                  (() => {
                    const tc = testCases[selectedCase];
                    const res = results[selectedCase];
                    let icon = <span className="text-gray-400">⏺</span>;
                    let outputVal = '';
                    let hint = '';
                    let runtime = '';
                    let memory = '';
                    if (res && selectedCase < revealedCount) {
                      icon = res.passed ? <span className="text-green-400">✔️</span> : <span className="text-red-400">❌</span>;
                      outputVal = res.output;
                      runtime = res.runtime ? `${res.runtime}s` : '--';
                      memory = res.memory ? `${res.memory} KB` : '--';
                      if (!res.passed) {
                        hint = tc.hint || 'Check your logic and edge cases.';
                      }
                    }
                    return (
                      <div className={`flex flex-col gap-1 animate-fade-in`} style={{ opacity: res && selectedCase < revealedCount ? 1 : 0.5 }}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="text-white">Case {selectedCase + 1} Details:</span>
                          <span className="text-gray-300">Input:</span>
                          <code className="bg-neutral-800 px-2 py-1 rounded">{tc.input}</code>
                          <span className="text-gray-300">Expected:</span>
                          <code className="bg-neutral-800 px-2 py-1 rounded">{tc.output}</code>
                          <span className="text-gray-300">Output:</span>
                          <code className="bg-neutral-800 px-2 py-1 rounded">{outputVal || '--'}</code>
                        </div>
                        {hint && (
                          <div className="text-yellow-400 text-xs ml-8">💡 Hint: {hint}</div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fadeIn 0.7s;
                }
              `}</style>
              <style>{`
                @media (max-width: 900px) {
                  .responsive-flex { flex-direction: column !important; }
                  .responsive-panel { width: 100% !important; }
                }
              `}</style>
            </div>

          </div>
        </div>
      </div>
    
  )
}