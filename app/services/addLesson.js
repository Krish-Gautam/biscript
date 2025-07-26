import { supabase } from "../utils/supabaseClient";

export const addLesson = async (form) => {
  const lesson = {
    title: form.title,
    language: form.language,
    description: form.description,
    difficulty: form.difficulty,
  };

  const { data, error } = await supabase
    .from("lessons")
    .insert([lesson])
    .select(); // 🟢 returns the inserted row(s)

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  console.log("Lesson added successfully:", data);
  return { data, error };
};
