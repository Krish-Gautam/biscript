"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addScript } from "../../services/addScript";


export default function ScriptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    lesson_id: lessonId,
    content_text: "",
    line_number: ""
  });

    const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(form)
      const {data, error} = await addScript(form)
  
      if(error){
        console.log(error)
      } else{
        alert("Script is been added")
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-lg bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6"> "Add Script"</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Line Number</label>
            <input
              type="text"
              name='line_number'
              value={form.line_number}
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Code</label>
            <textarea
            name='content_text'
              value={form.content_text}
              onChange={e => handleChange(e)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white font-mono focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows={3}
              required
            />
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
              disabled={isLoading}
              className="flex-1 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 