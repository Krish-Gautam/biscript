import { supabase } from "../utils/supabaseClient";

export const addChallenge = async (form) => {
  const challenge = {
    title: form.title,
    description: form.description,
    type: form.challengeType,
    solution: form.solution,
    hint: form.hint,
    participants: form.participants,
    category: form.category,
    points: form.points,
  };

  const { data, error } = await supabase
    .from("challenges")
    .insert([challenge])
    .select(); // 🟢 returns the inserted row(s)

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  return { data, error };
};
