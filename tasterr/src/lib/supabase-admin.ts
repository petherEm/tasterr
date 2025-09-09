import { createClient } from "@supabase/supabase-js"

// Admin client with service role for bypassing RLS
export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  
  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}