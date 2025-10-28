import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
