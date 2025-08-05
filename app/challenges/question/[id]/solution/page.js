'use client'
import React, { useState } from 'react'
import { que_data } from '@/app/challenges/quedata/questions'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SolutionPage() {
     const params=useParams();
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  
  const questionId = parseInt(params.id)
  const question = que_data.find(item => item.id === questionId)

  const runSolution = async () => {
    setIsRunning(true)
    setOutput('Running solution...')
    
    try {
      // Simulate code execution
      setTimeout(() => {
        // Extract print statements from solution
        if (question.solution && question.solution.includes('print')) {
          const matches = question.solution.match(/print\(["'](.*?)["']\)/g)
          if (matches) {
            const outputs = matches.map(match => {
              const content = match.match(/print\(["'](.*?)["']\)/)[1]
              return content
            })
            setOutput(outputs.join('\n'))
          } else {
            setOutput(question.expected_output || 'Solution executed successfully!')
          }
        } else {
          setOutput(question.expected_output || 'Solution executed successfully!')
        }
        setIsRunning(false)
      }, 1500)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
      setIsRunning(false)
    }
  }

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
              <Link href={`/challenges/question/${questionId}`} className="text-blue-400 hover:text-blue-300 transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">Challenge {question.id} - Solution</h1>
            </div>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
              Solution
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
                  {question.que}
                </p>
              </div>

              {/* Solution Explanation */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Solution Explanation</h3>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-300 space-y-2">
                    {question.explanation ? (
                      question.explanation.map((step, index) => (
                        <p key={index} className="flex items-start">
                          <span className="font-bold mr-2 text-green-400">{index + 1}.</span>
                          {step}
                        </p>
                      ))
                    ) : (
                      <div>
                        <p>• This solution demonstrates the most efficient approach</p>
                        <p>• The code uses built-in Python libraries for optimal performance</p>
                        <p>• Each step is clearly commented for better understanding</p>
                        <p>• The solution handles edge cases and input validation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Time & Space Complexity */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Time Complexity</h4>
                  <p className="text-blue-300">{question.time_complexity || "O(n)"}</p>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Space Complexity</h4>
                  <p className="text-purple-300">{question.space_complexity || "O(1)"}</p>
                </div>
              </div>

              {/* Try Coding Link */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Want to practice?</h4>
                <Link 
                  href={`/challenges/question/${questionId}/code`}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors inline-block border border-yellow-500/30"
                >
                  Try Coding Yourself
                </Link>
              </div>
            </div>
          </div>

          {/* Solution Code Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Editor Header */}
            <div className="bg-green-600/20 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
              <span className="font-medium text-green-400">Solution Code (Python)</span>
              <div className="flex gap-2">
                <button
                  onClick={runSolution}
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
                      ▶ Run Solution
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Solution Code Display */}
            <div className="flex-1 bg-neutral-900 overflow-y-auto">
              <pre className="text-green-400 font-mono text-sm p-4 h-full whitespace-pre-wrap">
                {question.solution || `# Solution for Challenge ${question.id}
# This is a sample solution

def solve_problem():
    """
    Solution for: ${question.que}
    """
    # Add the actual solution code in your questions.js
    print("This is a sample solution")
    print("Update your questions.js with actual solution code")
    
    return "Solution completed"

# Test the solution
result = solve_problem()
print(f"Result: {result}")`}
              </pre>
            </div>

            {/* Output Panel */}
            <div className="h-48 bg-black text-green-400 p-4 overflow-y-auto font-mono text-sm border-t border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold">Output:</span>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <pre className="whitespace-pre-wrap text-green-300">
                {output || 'Click "Run Solution" to see output...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}