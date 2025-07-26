import { supabase } from "../utils/supabaseClient";

export const addScript = async (form) => {
    const script = {
        lesson_id: form.lesson_id,
        content_text: form.content_text,
        line_number: form.line_number
    }
    const {data, error} = await supabase.from('goblin_script').insert([script]).select()

    if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  console.log("Script added successfully:", data);
  return { data, error };
} 