"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { Copy, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { getChallengeById } from "../services/challengesServices";
import { Play} from "lucide-react";

const languageOptions = [
  { id: 63, name: "JavaScript", langExt: javascript },
  { id: 71, name: "Python", langExt: python },
  { id: 54, name: "C++", langExt: cpp },
  { id: 62, name: "Java", langExt: java },
];

/**
 * Normalize testcases from DB schema.
 *
 * DB stores: testcases: [{ input: [...], output: [...] }]
 * We need:   { inputs: [...], outputs: [...] }
 */
function normalizeTestcases(raw) {
  if (!raw) return { inputs: [], outputs: [] };

  // Already flat object with input/output arrays (old format)
  if (!Array.isArray(raw) && raw.input) {
    return {
      inputs: Array.isArray(raw.input) ? raw.input : [raw.input],
      outputs: Array.isArray(raw.output) ? raw.output : [raw.output],
    };
  }

  // Array of objects — DB format: [{ input: [...], output: [...] }]
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];

    // Each element is { input: value, output: value } — individual test cases
    if (
      !Array.isArray(first.input) &&
      ("input" in first || "output" in first)
    ) {
      return {
        inputs: raw.map((tc) => tc.input ?? "--"),
        outputs: raw.map((tc) => tc.output ?? "--"),
      };
    }

    // First element has arrays: { input: [...], output: [...] }
    if (Array.isArray(first.input) || Array.isArray(first.output)) {
      return {
        inputs: first.input ?? [],
        outputs: first.output ?? [],
      };
    }

    // First element has single values
    if ("input" in first) {
      return {
        inputs: raw.map((tc) => tc.input ?? "--"),
        outputs: raw.map((tc) => tc.output ?? "--"),
      };
    }
  }

  return { inputs: [], outputs: [] };
}

export default function PlayGround() {
  const [selectedCase, setSelectedCase] = useState(0);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [code, setCode] = useState("# Write your Python code here\n\n");
  const [output, setOutput] = useState("");
  const [results, setResults] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [panelWidth, setPanelWidth] = useState(30);
  const sliderRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState({
    id: 71,
    name: "Python",
    langExt: python,
  });
  const [running, setRunning] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [testcases, setTestcases] = useState({ inputs: [], outputs: [] });
  const { challengeId } = useParams();
  const { user, loading } = useAuth();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth/register");
    } else {
      setCurrentUser(user);
    }
  }, [user, loading]);

  const handleCopySolution = async () => {
    try {
      await navigator.clipboard.writeText(question.solution);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const [copyTimer, setCopyTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (copyTimer) clearTimeout(copyTimer);
    };
  }, [copyTimer]);

  const codeWindowRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!showSolution) return;
    const codeWindow = codeWindowRef.current;
    const header = headerRef.current;
    if (!codeWindow || !header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      const rect = codeWindow.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = "none";
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      codeWindow.style.left = `${e.clientX - offsetX}px`;
      codeWindow.style.top = `${e.clientY - offsetY}px`;
    };
    const onMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = "";
    };

    header.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [showSolution]);

  function formatOutput(value) {
    if (value === null || value === undefined) return "--";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    return JSON.stringify(value, null, 2);
  }

  useEffect(() => {
    if (!challengeId) return;

    const fetchData = async () => {
      try {
        setIsLoadingContent(true);
        const response = await getChallengeById(challengeId);
        const data = response.data;

        // ✅ Normalize testcases from DB format
        const normalized = normalizeTestcases(data.testcases);
        setTestcases(normalized);

        setQuestion({
          ...data,
          testcases: data.testcases, // keep raw for reference
        });

      } catch (err) {
        console.error("Error fetching challenge:", err);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchData();
  }, [challengeId]);

  const runCode = async () => {
    if (!language) return;
    setRunning(true);
    setOutput("Running...");
    setResults([]);
    setRevealedCount(0);

    try {
      const res = await fetch(`${API_BASE_URL}/api/runCode/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          source_code: code,
          language_id: language.id,
          userId: currentUser?._id,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setOutput("");

      // Animate reveal
      setRevealedCount(0);
      if (data.results && data.results.length > 0) {
        let i = 0;
        const revealNext = () => {
          setRevealedCount(i + 1);
          i++;
          if (i < data.results.length) {
            setTimeout(revealNext, 400);
          }
        };
        setTimeout(revealNext, 400);
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  if (!question && !isLoadingContent) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Question Not Found
          </h1>
          <Link
            to="/challenges"
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl transition-colors border border-white/10"
          >
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  if (isLoadingContent || !question) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const { inputs: tcInputs, outputs: tcOutputs } = testcases;

  return (
    <div className="min-h-screen bg-neutral-950 relative animate-fade-in">
      {/* Floating Solution Window */}
      {showSolution && (
        <div
          ref={codeWindowRef}
          className="fixed z-50 w-[60%] max-w-3xl bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-2xl"
          style={{ left: "50%", top: "20%" }}
        >
          <div
            ref={headerRef}
            className="cursor-grab active:cursor-grabbing flex items-center justify-between px-4 py-2 bg-[#2a2a2a] border-b border-gray-700 rounded-t-xl"
          >
            <span className="text-sm text-gray-300 font-semibold">
              Solution
            </span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (copied) return;
                  await handleCopySolution();
                  setCopied(true);
                  const t = setTimeout(() => setCopied(false), 2000);
                  setCopyTimer(t);
                }}
                disabled={copied}
                className={`cursor-pointer px-3 py-1.5 rounded-md border ${
                  copied
                    ? "bg-green-600/20 text-green-400 border-green-700"
                    : "bg-[#232526] hover:bg-[#2e2f31] text-gray-200 border-gray-700"
                }`}
                title={copied ? "Copied" : "Copy code"}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => setShowSolution(false)}
                className="cursor-pointer px-3 py-1.5 rounded-md border bg-[#232526] hover:bg-[#2e2f31] text-gray-200 border-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-3">
            <CodeMirror
              value={question.solution}
              extensions={[python()]}
              theme="dark"
              editable={false}
              height="300px"
            />
          </div>
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900/80 backdrop-blur-lg border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/challenges"
                className="text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">
                Challenge — {question.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {question.points && (
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-500/30 font-semibold">
                  🏆 {question.points} pts
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm border font-semibold ${
                  question.category === "Easy"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : question.category === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {question.category}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Question Panel */}
          <div
            className="bg-neutral-900/60 backdrop-blur-sm border-r border-white/10 overflow-y-auto hide-scrollbar"
            style={{ width: `${panelWidth}%` }}
          >
            <div className="p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4">
                Problem Statement
              </h2>

              <div className="bg-neutral-800/50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-gray-200 leading-relaxed">
                  {question.description}
                </p>
              </div>

              {/* Skills tested */}
              {question.skill_tested && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Skills Tested
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const skills = JSON.parse(question.skill_tested);
                        return skills.map((s) => (
                          <span
                            key={s}
                            className="bg-blue-500/10 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/20"
                          >
                            {s}
                          </span>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Hints + Solution buttons */}
              <div className="mb-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="bg-yellow-500/20 cursor-pointer hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors border border-yellow-500/30 text-sm"
                >
                  {showHints ? "Hide Hints" : "Show Hints"} 💡
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-purple-500/20 cursor-pointer hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors border border-purple-500/30 text-sm"
                >
                  {showSolution ? "Hide Solution" : "Show Solution"} 🔑
                </button>
              </div>

              {showHints && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-yellow-400 mb-2">Hints:</h3>
                  <div className="text-yellow-300 space-y-2 text-sm">
                    {question.hint ? (
                      <p className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">1.</span>
                        {question.hint}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p>• Break down the problem into smaller steps</p>
                        <p>• Think about what data structures you might need</p>
                        <p>• Consider edge cases and input validation</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ Test case examples — fixed to use normalized testcases */}
              {tcInputs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Examples
                  </h3>
                  {tcInputs.map((input, index) => (
                    <div
                      key={index}
                      className="bg-neutral-800/50 rounded-lg p-4 border border-white/5"
                    >
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Example {index + 1}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-16 shrink-0 pt-1">
                            Input
                          </span>
                          <code className="text-sm text-emerald-300 bg-black/40 px-3 py-1 rounded font-mono break-all">
                            {formatOutput(input)}
                          </code>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-16 shrink-0 pt-1">
                            Output
                          </span>
                          <code className="text-sm text-blue-300 bg-black/40 px-3 py-1 rounded font-mono break-all">
                            {formatOutput(tcOutputs[index] ?? "--")}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tcInputs.length === 0 && !isLoadingContent && (
                <div className="text-gray-500 text-sm italic mt-4">
                  No example test cases available.
                </div>
              )}
            </div>
          </div>

          {/* Drag Slider */}
          <div
            ref={sliderRef}
            className="group flex items-center justify-center"
            style={{
              width: "6px",
              height: "100%",
              cursor: "col-resize",
              zIndex: 50,
              background: "gray",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = panelWidth;
              function onMouseMove(ev) {
                const dx = ev.clientX - startX;
                const newWidth = Math.min(
                  80,
                  Math.max(20, startWidth + (dx * 100) / window.innerWidth),
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
            <div className="flex flex-col items-center gap-[4px]">
              <div className="w-[6px] h-[6px] rounded-full bg-gray-600"></div>
              <div className="w-[6px] h-[6px] rounded-full bg-gray-600"></div>
              <div className="w-[6px] h-[6px] rounded-full bg-gray-600"></div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div
            className="flex flex-col"
            style={{ width: `${100 - panelWidth}%` }}
          >
            {/* Editor Header */}
            <div className="bg-neutral-800 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-white">Code Editor</span>
                <select
                  value={language.id}
                  onChange={(e) => {
                    const selected = languageOptions.find(
                      (l) => l.id === Number(e.target.value),
                    );
                    setLanguage(selected);
                    setCode(
                      selected.name === "Python"
                        ? "# Write your Python code here\n\n"
                        : selected.name === "JavaScript"
                          ? "// Write your JavaScript code here\n\n"
                          : selected.name === "C++"
                            ? "// Write your C++ code here\n\n"
                            : "// Write your Java code here\n\n",
                    );
                  }}
                  className="bg-neutral-900 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-sm"
                  style={{ minWidth: 120 }}
                >
                  {languageOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-neutral-900 text-white"
                    >
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={runCode}
                disabled={running}
                className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                {running ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Running...
                  </>
                ) : (
                  <><Play size={16} />Run Code</>
                )}
              </button>
            </div>

            {/* CodeMirror Editor */}
            <div className="flex-1 min-h-0 bg-neutral-900 overflow-hidden">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[
                  language.langExt ? language.langExt() : python(),
                  EditorView.lineWrapping,
                ]}
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
                  backgroundColor: "#1a1a1a",
                  color: "#eee",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Output / Test Results Panel */}
            <div className="h-52 bg-[#0d0d0d] text-green-400 p-4 overflow-y-auto font-mono text-sm border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-bold">Test Cases</span>
                {running && (
                  <span className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></span>
                )}
                {/* Summary badge */}
                {results.length > 0 && revealedCount >= results.length && (
                  <span
                    className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded ${
                      results.every((r) => r.passed)
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {results.filter((r) => r.passed).length}/{results.length}{" "}
                    Passed
                  </span>
                )}
              </div>

              {/* ✅ Test case tabs — uses normalized tcInputs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {tcInputs.length > 0 ? (
                  tcInputs.map((_, idx) => {
                    const res = results?.[idx];
                    let icon = <span className="text-gray-500">●</span>;
                    if (res && idx < revealedCount) {
                      icon = res.passed ? (
                        <span className="text-green-400">✔</span>
                      ) : (
                        <span className="text-red-400">✘</span>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCase(idx)}
                        className={`cursor-pointer select-none px-3 py-1.5 rounded text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          selectedCase === idx
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-300 ring-1 ring-blue-400"
                            : "bg-neutral-800 border-gray-700 text-gray-300 hover:bg-neutral-700"
                        }`}
                      >
                        {icon} Case {idx + 1}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-xs">
                    No test cases found.
                  </span>
                )}
              </div>

              {/* Selected case detail */}
              {tcInputs[selectedCase] !== undefined && (
                <div
                  className="flex flex-col gap-1.5 animate-fade-in"
                  style={{
                    opacity:
                      results[selectedCase] && selectedCase < revealedCount
                        ? 1
                        : 0.6,
                  }}
                >
                  {(() => {
                    const res = results?.[selectedCase];
                    const outputVal =
                      res && selectedCase < revealedCount
                        ? formatOutput(res.output)
                        : "--";
                    const runtime = res?.runtime ? `${res.runtime}s` : "--";
                    const memory = res?.memory ? `${res.memory} KB` : "--";

                    return (
                      <>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          {res && selectedCase < revealedCount && (
                            <span
                              className={
                                res.passed
                                  ? "text-green-400 font-bold"
                                  : "text-red-400 font-bold"
                              }
                            >
                              {res.passed ? "✔ Passed" : "✘ Failed"}
                            </span>
                          )}

                          <span className="text-gray-400">
                            Input:{" "}
                            <code className="bg-neutral-800 px-2 py-0.5 rounded text-gray-200">
                              {formatOutput(tcInputs[selectedCase])}
                            </code>
                          </span>

                          <span className="text-gray-400">
                            Expected:{" "}
                            <code className="bg-neutral-800 px-2 py-0.5 rounded text-blue-300">
                              {formatOutput(tcOutputs[selectedCase] ?? "--")}
                            </code>
                          </span>

                          <span className="text-gray-400">
                            Got:{" "}
                            <code
                              className={`px-2 py-0.5 rounded ${
                                res && selectedCase < revealedCount
                                  ? res.passed
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                                  : "bg-neutral-800 text-gray-400"
                              }`}
                            >
                              {outputVal}
                            </code>
                          </span>

                          {res && selectedCase < revealedCount && (
                            <>
                              <span className="text-gray-500 text-xs">
                                ⏱ {runtime}
                              </span>
                              <span className="text-gray-500 text-xs">
                                💾 {memory}
                              </span>
                            </>
                          )}
                        </div>

                        {res && !res.passed && selectedCase < revealedCount && (
                          <div className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                            💡{" "}
                            <span>Hint: Check your logic and edge cases.</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {output && !running && (
                <div className="mt-2 text-red-400 text-xs">{output}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
