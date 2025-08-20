import { supabase } from "../utils/supabaseClient";

export const getUserChallenges = async (userId) => {
  const { data, error } = await supabase
      .from("user_challenges")
      .select("*")
      .eq("user_id", userId);

      if (error) {
    console.error("Error fetching user challenges:", error);
  }
  return { data, error };
};
