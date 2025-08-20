import { supabase } from "../utils/supabaseClient";

export async function getChallengeData(challengeId) {
  console.log("Fetching challenge for ID:", challengeId);

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId);

  console.log("Supabase data:", data, "error:", error);
  return data;
}