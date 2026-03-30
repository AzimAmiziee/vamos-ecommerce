import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser singleton
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server components
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
