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

export default function CodingPage({ params }) {
  // const { challengeId } = useParams()
  const [code, setCode] = useState('# Write your Python code here\n\n')
  const [output, setOutput] = useState('')
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
        const fetchData = async () => {
          const  challengedata = await getChallengeData(challengeId)
          console.log('challengedata:', challengedata)
          setQuestion(challengedata[0])
          const testdata = await getTestCases(challengeId)
          setTestCases(testdata)
          console.log('testdata:', testdata)
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
    //     console.log('challengedata', data)
    //     console.log('challengedata', data[0])
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

    if (data.allPassed) {
      setOutput("✅ All test cases passed! Challenge completed.");
    } else {
      setOutput(`❌ Some test cases failed:\n${JSON.stringify(data.results, null, 2)}`);
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
    <div className="min-h-screen bg-neutral-950 relative">
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
              <h1 className="text-xl font-bold text-white">Challenge - Coding Environment</h1>
            </div>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm border border-white/20">
              {question.category}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Question Panel */}
          <div className="w-1/2 bg-neutral-900/60 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Problem Statement</h2>
              <div className="bg-neutral-800/50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-gray-200 leading-relaxed">
                  {question.description}
                </p>
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
                <div className="space-y-4">
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

          {/* Code Editor Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Editor Header */}
            <div className="bg-neutral-800 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <span className="font-medium text-white">Python Editor</span>
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
                <span className="text-white font-bold">Output:</span>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to see output...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}