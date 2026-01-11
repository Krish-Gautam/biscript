import { supabase } from "../utils/supabaseClient";

export const updateChallenge = async (challengeId, form) => {
  if (!challengeId) {
    throw new Error("challengeId is required for update");
  }

  const challenge = {
    title: form.title,
    description: form.description,
    type: form.challengeType, // ✅ match DB column
    solution: form.solution,
    function_name: form.function_name,
    skill_tested: form.skill_tested,
    hint: form.hint,
    participants: form.participants,
    category: form.category,
    points: form.points,
  };

  const { data, error } = await supabase
    .from("challenges")
    .update(challenge)
    .eq("id", challengeId) // ✅ THIS IS NON-NEGOTIABLE
    .select()
    .single(); // expect exactly one row

  if (error) {
    console.error("Supabase Update Error:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
};
