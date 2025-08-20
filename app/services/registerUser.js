import { supabase } from "../utils/supabaseClient";

// Handles auth + inserting into profiles table
export async function registerUser({ email, password, username }) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    username,
    password,
    options: {
    emailRedirectTo: 'http://localhost:3000/profile', // or your real frontend route
    data: { username }, // optional metadata
  },
  })

  if (signUpError) {
    // Handle "User already registered" case
    if (
      signUpError.message.includes("User already registered") ||
      signUpError.message.includes("email") // fallback for other error messages
    ) {
      return { error: { message: "User already exists with this email." } };
    }

    // Return any other errors
    return { error: signUpError };
  }

  const user = signUpData.user

  const { error: dbError } = await supabase.from('profiles').insert([
    {
      id: user.id,
      username,
      email
    }
  ])

  if (dbError) return { error: dbError }

  return { data: user }
}
