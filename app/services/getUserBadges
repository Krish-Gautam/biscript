import { supabase } from "../utils/supabaseClient";

export const getUserBadges = async (userId) => {
  const { data, error } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId);

      if (error) {
    console.error("Error fetching user badges:", error);
  }
  return { data, error };
};