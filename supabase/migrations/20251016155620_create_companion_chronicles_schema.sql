/*
  # Companion Chronicles Database Schema

  ## Overview
  Complete database schema for The Companion Chronicles adaptive puzzle game.
  Tracks user profiles, cognitive abilities, session history, companion progression,
  and adaptation algorithm state.

  ## Tables Created
  
  ### 1. `users`
  - `id` (uuid, primary key) - Unique user identifier
  - `username` (text) - Kid's chosen name
  - `tier` (text) - jr-detective, detective, or master-detective
  - `subscription_tier` (text) - free or paid
  - `sessions_this_month` (int) - Counter for free tier limits
  - `created_at` (timestamptz) - Account creation date
  - `last_played` (timestamptz) - Last session timestamp

  ### 2. `companions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to users table
  - `name` (text) - Companion's custom name
  - `personality` (text) - owl, fox, or robot
  - `level` (int) - 1-50 progression
  - `xp` (int) - Experience points toward next level
  - `cosmetics` (jsonb) - Unlocked cosmetic items

  ### 3. `cognitive_profiles`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to users table
  - `patterns` (int) - Pattern recognition score (0-100)
  - `spatial` (int) - Spatial reasoning score (0-100)
  - `logic_score` (int) - Logical reasoning score (0-100)
  - `lateral_thinking` (int) - Lateral thinking score (0-100)
  - `sequencing` (int) - Sequential planning score (0-100)
  - `updated_at` (timestamptz) - Last profile update

  ### 4. `sessions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to users table
  - `zone_id` (int) - Which zone was played (1-3)
  - `started_at` (timestamptz) - Session start time
  - `completed_at` (timestamptz) - Session end time
  - `puzzles_completed` (int) - Number of puzzles solved
  - `total_score` (int) - Aggregate session score

  ### 5. `puzzle_attempts`
  - `id` (uuid, primary key)
  - `session_id` (uuid, foreign key) - Links to sessions table
  - `user_id` (uuid, foreign key) - Links to users table
  - `puzzle_type` (text) - sequence, mirror, gear, logic, or spatial
  - `difficulty` (text) - easy, medium, or hard
  - `difficulty_rating` (int) - Numeric difficulty (0-100)
  - `solved` (boolean) - Whether puzzle was completed
  - `score` (int) - Puzzle score (0-100)
  - `time_taken` (int) - Seconds to complete
  - `attempts_used` (int) - Number of attempts before solving
  - `hints_used` (int) - Number of hints requested
  - `optimal_moves` (int) - Best possible move count
  - `actual_moves` (int) - Actual move count
  - `created_at` (timestamptz) - Attempt timestamp

  ### 6. `profile_history`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to users table
  - `patterns` (int) - Snapshot of patterns score
  - `spatial` (int) - Snapshot of spatial score
  - `logic_score` (int) - Snapshot of logic score
  - `lateral_thinking` (int) - Snapshot of lateral score
  - `sequencing` (int) - Snapshot of sequencing score
  - `recorded_at` (timestamptz) - Snapshot timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  tier text NOT NULL DEFAULT 'detective',
  subscription_tier text NOT NULL DEFAULT 'free',
  sessions_this_month int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_played timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create companions table
CREATE TABLE IF NOT EXISTS companions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  personality text NOT NULL DEFAULT 'fox',
  level int DEFAULT 1,
  xp int DEFAULT 0,
  cosmetics jsonb DEFAULT '{"hat": "none", "aura": "none", "color": "default", "idleAnimation": "none"}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companion"
  ON companions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own companion"
  ON companions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own companion"
  ON companions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create cognitive_profiles table
CREATE TABLE IF NOT EXISTS cognitive_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  patterns int DEFAULT 50,
  spatial int DEFAULT 50,
  logic_score int DEFAULT 50,
  lateral_thinking int DEFAULT 50,
  sequencing int DEFAULT 50,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cognitive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cognitive profile"
  ON cognitive_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cognitive profile"
  ON cognitive_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cognitive profile"
  ON cognitive_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zone_id int NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  puzzles_completed int DEFAULT 0,
  total_score int DEFAULT 0
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create puzzle_attempts table
CREATE TABLE IF NOT EXISTS puzzle_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  puzzle_type text NOT NULL,
  difficulty text NOT NULL,
  difficulty_rating int NOT NULL,
  solved boolean DEFAULT false,
  score int DEFAULT 0,
  time_taken int DEFAULT 0,
  attempts_used int DEFAULT 0,
  hints_used int DEFAULT 0,
  optimal_moves int DEFAULT 0,
  actual_moves int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE puzzle_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own puzzle attempts"
  ON puzzle_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own puzzle attempts"
  ON puzzle_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own puzzle attempts"
  ON puzzle_attempts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create profile_history table for tracking improvements over time
CREATE TABLE IF NOT EXISTS profile_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patterns int NOT NULL,
  spatial int NOT NULL,
  logic_score int NOT NULL,
  lateral_thinking int NOT NULL,
  sequencing int NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile history"
  ON profile_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile history"
  ON profile_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companions_user_id ON companions(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_profiles_user_id ON cognitive_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_user_id ON puzzle_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_session_id ON puzzle_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_profile_history_user_id ON profile_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_history_recorded_at ON profile_history(recorded_at DESC);