import { supabase } from "../utils/supabaseClient";

// Handles auth + inserting into profiles table
export async function registerUser({ email, password, username }) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  })

  if (signUpError) return { error: signUpError }

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
