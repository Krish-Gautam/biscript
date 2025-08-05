import { supabase } from "../utils/supabaseClient";

export const getGoblinLines = async (id) => {
   const { data, error } = await supabase.from('goblin_script').select('*').eq('lesson_id', id);
   
   if (error) {
    console.error("Error fetching goblin lines:", error);
  }
  return { data, error };
}