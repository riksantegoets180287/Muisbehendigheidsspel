/*
  # Create game results table

  1. New Tables
    - `game_results`
      - `id` (uuid, primary key)
      - `first_name` (text) - Student's first name
      - `ps_number` (text) - PS student number
      - `total_score` (integer) - Total points earned (0-200)
      - `percentage` (numeric) - Percentage achieved
      - `play_time_seconds` (integer) - Total time spent playing
      - `passed` (boolean) - Whether student passed (≥55%)
      - `completed_at` (timestamptz) - Timestamp of completion
      - `created_at` (timestamptz) - Record creation time
  
  2. Security
    - Enable RLS on `game_results` table
    - Add policy for anyone to insert their own results
    - Add policy for anyone to read results (for viewing purposes)
    
  3. Notes
    - This is a client-side game where authentication is minimal
    - Students can view their results after completion
    - Data is stored for record-keeping purposes
*/

CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  ps_number text NOT NULL,
  total_score integer NOT NULL CHECK (total_score >= 0 AND total_score <= 200),
  percentage numeric(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  play_time_seconds integer NOT NULL CHECK (play_time_seconds >= 0),
  passed boolean NOT NULL,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert game results"
  ON game_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read game results"
  ON game_results
  FOR SELECT
  TO anon
  USING (true);