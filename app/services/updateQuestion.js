import { supabase } from "../utils/supabaseClient";

export const updateQuestion = async (form) => {
  const { data, error } = await supabase
    .from("questions")
    .update({
      question_text: form.question_text,
      correct_ans: form.correct_ans,
      difficulty: form.difficulty, // ✅ fixed typo
    })
    .eq("id", form.id);

  if (error) {
    console.error("Supabase Update Error:", error.message);
  }

  return { data, error }; // ✅ return both
};
