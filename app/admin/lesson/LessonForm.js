"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addLesson } from "@/app/services/addLesson";
import { supabase } from "@/app/utils/supabaseClient";
import { updateLesson } from "@/app/services/updateLesson";

const difficultyOptions = [
  { id: 63, name: "Easy" },
  { id: 71, name: "Medium" },
  { id: 54, name: "Hard" },
];


export default function LessonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language")
  const lessonId = searchParams.get("id");
  const [lessonData, setLessonData] = useState({})
  const [difficulty, setdifficulty] = useState(lessonData.difficulty)
  const [form, setForm] = useState({
    id: lessonId,
    title: lessonData.title || "",
    description: lessonData.description || "",
    language: language || "",
    difficulty: difficulty || "" });


  useEffect(() => {
  const fetchLesson = async (id) => {
    if (!id) return;
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching lesson:", error);
    } else {
      setLessonData(data[0]);
    }
  };

  fetchLesson(lessonId);
}, [lessonId]);

useEffect(() => {
  if (lessonData && lessonId) {
    setForm({
      id: lessonId,
      title: lessonData.title || "",
      description: lessonData.description || "",
      language: language || "",
      difficulty: lessonData.difficulty || difficultyOptions[0].name,
    });
  }
}, [lessonData, language, lessonId]);


  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const {data, error} = await updateLesson(form);

    if(error){
      console.log(error)
    } else{
      alert("Lesson is been updated")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-lg bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        {/* <h2 className="text-2xl font-bold mb-6">{lessonId ? "Edit Lesson" : "Add Lesson"}</h2> */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block mb-1 text-gray-300">Lesson Title</label>
            <input
              type="text"
              value={form.title}
              name='title'
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Language</label>
            <div className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500">
                {language}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Description</label>
            <textarea
              value={form.description}
              name='description'
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows={4}
              required
            />
          </div>
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
              className="flex-1 py-2 bg-[#28c244] text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
          {/* {message && <div className="mt-4 text-green-400">{message}</div>} */}
        </form>
      </div>
    </div>
  );
} 
