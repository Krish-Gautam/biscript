import { supabase } from "../utils/supabaseClient";

export async function registerUser({ email, password, username }) {
  // Step 0: Check if username exists BEFORE signup
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    return { error: { message: "Username is already taken" } };
  }

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows found (which is fine)
    return { error: { message: checkError.message } };
  }

  // Step 1: Sign up user in Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/profile",
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

  const user = signUpData.user;

  // Step 2: Insert into profiles
  const { error: dbError } = await supabase.from("profiles").insert([
    {
      id: user.id,
      username,
      email,
    },
  ]);

  if (dbError) {
    return { error: { message: dbError.message } };
  }

  return { data: user };
}
