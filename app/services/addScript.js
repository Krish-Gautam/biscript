import { supabase } from "../utils/supabaseClient";

export const addScript = async ({title, lessonId, plan}) => {
    const script = {
        lesson_id: lessonId,
        title: title,
        plan: plan
    }
    const {data, error} = await supabase.from('goblin_script').insert([script]).select()

    if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  return { data, error };
} 