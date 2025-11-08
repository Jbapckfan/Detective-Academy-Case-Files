import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          tier: string;
          subscription_tier: string;
          sessions_this_month: number;
          created_at: string;
          last_played: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      companions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          personality: string;
          level: number;
          xp: number;
          cosmetics: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['companions']['Insert']>;
      };
      cognitive_profiles: {
        Row: {
          id: string;
          user_id: string;
          patterns: number;
          spatial: number;
          logic_score: number;
          lateral_thinking: number;
          sequencing: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cognitive_profiles']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cognitive_profiles']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          zone_id: number;
          started_at: string;
          completed_at: string | null;
          puzzles_completed: number;
          total_score: number;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      puzzle_attempts: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          puzzle_type: string;
          difficulty: string;
          difficulty_rating: number;
          solved: boolean;
          score: number;
          time_taken: number;
          attempts_used: number;
          hints_used: number;
          optimal_moves: number;
          actual_moves: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['puzzle_attempts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['puzzle_attempts']['Insert']>;
      };
      profile_history: {
        Row: {
          id: string;
          user_id: string;
          patterns: number;
          spatial: number;
          logic_score: number;
          lateral_thinking: number;
          sequencing: number;
          recorded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profile_history']['Row'], 'id' | 'recorded_at'>;
        Update: Partial<Database['public']['Tables']['profile_history']['Insert']>;
      };
    };
  };
}
