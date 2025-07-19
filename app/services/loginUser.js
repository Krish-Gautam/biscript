import { supabase } from "../utils/supabaseClient";

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Wrong email or password. Try again." };
    } else {
      return { error: "Something went wrong: " + error.message };
    }
  }

  return { data };
}
