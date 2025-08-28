import { supabase } from "../utils/supabaseClient";

export const getChallenges = async (challengeType) => {
    const { data, error} = await supabase.from('challenges').select('*').eq('type', challengeType)

    if (error) {
    console.error("Error fetching challenges:", error);
  }
  return { data, error };
} 