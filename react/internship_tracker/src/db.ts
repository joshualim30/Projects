// db.ts
// Database connection using Supabase

import { createClient } from '@supabase/supabase-js'

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export the Supabase client
export default supabase