import { supabase } from "../utils/supabaseClient";

export const addTestCases = async (TestCases) => {
  const { data, error } = await supabase
    .from("test_case")
    .insert([TestCases])
    .select();

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { data: null, error };
  }

  return { data, error };
};
