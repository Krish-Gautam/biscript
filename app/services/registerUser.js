import { supabase } from "../utils/supabaseClient";

export async function registerUser({ email, password, username }) {
  // Step 0: Check if username exists BEFORE signup
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username);

  if (error) {
    return { error: { message: error.message } };
  }

  if (data.length > 0) {
    return { error: { message: "Username already taken" } };
  }

  // Step 1: Sign up user in Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { username },
    },
  });

  if (signUpError) {
    if (
      signUpError.message.includes("already registered") ||
      signUpError.message.toLowerCase().includes("email")
    ) {
      return { error: { message: "Email is already in use" } };
    }
    return { error: { message: signUpError.message } };
  }

  // 🚨 IMPORTANT CHECK
  if (!signUpData.user || !signUpData.session) {
    return {
      message: "Check your email to confirm your account before logging in.",
    };
  }


  return { data: user };
}
