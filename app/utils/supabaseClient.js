// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Always available (anon key) – safe for frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only available in server env (service role key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Auto-pick key based on environment
const isServer = typeof window === 'undefined'
const supabaseKey = isServer && supabaseServiceRoleKey
  ? supabaseServiceRoleKey
  : supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,   // 👈 remembers login across reloads
    autoRefreshToken: true, // 👈 keeps user logged in if token expires
    detectSessionInUrl: true,
  },
})
