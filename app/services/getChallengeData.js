import { supabase } from "../utils/supabaseClient";

export async function getChallengeData(challengeId) {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)

    .single();

  if (error) throw error;
  return data;
}
