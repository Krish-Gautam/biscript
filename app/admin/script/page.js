"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateScript } from "@/app/services/updateScript";
import { supabase } from "@/app/utils/supabaseClient";

export default function ScriptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scriptId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(null); // initially null
  const [scriptData, setScriptData] = useState(null); // initially null

  useEffect(() => {
    const fetchScript = async (id) => {
      if (!id) return;
      const { data, error } = await supabase
        .from("goblin_script")
        .select("*")
        .eq("id", id)
        .single(); // optional: .single() gets the first object directly

      if (error) {
        console.error("Error fetching script:", error);
      } else if (data) {
        console.log('data', data)
        setScriptData(data);
        setForm({
          id: id,
          lessonId: data.lesson_id || "",
          content_text: data.content_text || "",
          line_number: data.line_number || "",
        });
      }
    };

    fetchScript(scriptId);
  }, [scriptId]);

  console.log('form', form)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await updateScript(form);

    setIsLoading(false);

    if (error) {
      console.log(error);
      alert("Failed to update script");
    } else {
      alert("Script has been updated");
      
    }
  };

  // Optional loading UI
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
        <p className="text-lg">Loading script...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-lg bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Update Script</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Line Number</label>
            <input
              type="text"
              name="line_number"
              value={form.line_number}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Code</label>
            <textarea
              name="content_text"
              value={form.content_text}
              onChange={handleChange}
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
