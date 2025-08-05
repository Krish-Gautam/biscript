"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addQuestion } from "@/app/services/addQuestion";

const difficultyOptions = [
  { id: 63, name: "Easy" },
  { id: 71, name: "Medium" },
  { id: 54, name: "Hard" },
];

export default function QuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("id");
  const lessonId = searchParams.get("lessonId");
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setdifficulty] = useState(difficultyOptions[0].name)
  const [answer, setAnswer] = useState("");
  const [form, setForm] = useState({
    lessonId: lessonId,
    question_text: "",
    correct_ans: "",
    difficulty: difficulty || ""
  })

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    const {data, error} = await addQuestion(form)
    
        if(error){
          console.log(error)
        } else{
          alert("Lesson is been updated")
        }
      };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-lg bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 select-none">{questionId ? "Edit Question" : "Add Question"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Question Text</label>
            <input
              type="text"
              name = "question_text"
              value={form.question_text}
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Answer</label>
            <input
              type="text"
              name= "correct_ans"
              value={form.correct_ans}
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          {/* <div>
            <label className="block mb-1 text-gray-300">Lesson</label>
            <select
              value={selectedLesson}
              onChange={e => setSelectedLesson(Number(e.target.value))}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {mockLessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>
          </div> */}

          <div>
          <label className="block mb-1 text-gray-300">Select difficulty</label>
          <select
            value={form.difficulty}
            name='difficulty'
            onChange={e => handleChange(e)}
            className="w-full px-2 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {difficultyOptions.map(diff => (
              <option key={diff.id} value={diff.name}>{diff.name}</option>
            ))}
          </select>
        </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              onClick={() => router.push("/admin")}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 