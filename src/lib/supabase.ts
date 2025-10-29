import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameResult {
  id?: string;
  first_name: string;
  ps_number: string;
  total_score: number;
  percentage: number;
  play_time_seconds: number;
  passed: boolean;
  completed_at: string;
  created_at?: string;
}
