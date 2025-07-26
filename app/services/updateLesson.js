import { supabase } from "../utils/supabaseClient";

export const updateLesson = async (form) => {
  const { data, error } = await supabase
    .from("lessons")
    .update({
      title: form.title,
      description: form.description,
      difficulty: form.difficulty, // ✅ fixed typo
      language: form.language,
    })
    .eq("id", form.id);

  if (error) {
    console.error("Supabase Update Error:", error.message);
  }

  return { data, error }; // ✅ return both
};
