import { supabase } from "../utils/supabaseClient"

export const testSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'krish@example.com',
    password: 'yourPassword123',
  })

  console.log(data, error)
}