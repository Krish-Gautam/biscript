import { supabase } from "../utils/supabaseClient";

export const updateScript = async (form) => {
  const script = {
    id: form.id,
    lesson_id: form.lessonId,
    content_text: form.content_text || "",
    line_number: form.line_number || "",
  }
  const { data, error } = await supabase.from('goblin_script').update(script).eq('id', form.id)

  if (error) {
    console.error("Supabase Update Error:", error.message);
  }

  return { data, error }; // ✅ return both
} 