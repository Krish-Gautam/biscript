import { supabase } from "../utils/supabaseClient";

export async function getChallengeData(challengeId) {

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId);

  return data;
}