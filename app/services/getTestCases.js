import { supabase } from "../utils/supabaseClient";

export const getTestCases = async(challengeId) => {
    const { data, error } = await supabase
    .from("test_case")
    .select("*")
    .eq("challenge_id", challengeId);

  if (error) throw error;
  return data || []; // Always return array
} 