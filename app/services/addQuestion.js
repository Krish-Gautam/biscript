import { supabase } from "../utils/supabaseClient";

export const addQuestion = async (form) => {
    const question = {
        lesson_id: form.lessonId,
        question_text: form.question_text,
        correct_ans: form.correct_ans,
        difficulty: form.difficulty
    }
    const {data, error} = await supabase.from('questions').insert([question]).select()

    if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  return { data, error };
}