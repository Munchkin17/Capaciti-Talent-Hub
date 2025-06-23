import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          candidate_id: string;
          full_name: string;
          email: string;
          phone?: string;
          linkedin_url?: string;
          github_url?: string;
          portfolio_url?: string;
          resume_url?: string;
          photo_url?: string;
          profile_summary?: string;
          role?: string;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          candidate_id?: string;
          full_name: string;
          email: string;
          phone?: string;
          linkedin_url?: string;
          github_url?: string;
          portfolio_url?: string;
          resume_url?: string;
          photo_url?: string;
          profile_summary?: string;
          role?: string;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          linkedin_url?: string;
          github_url?: string;
          portfolio_url?: string;
          resume_url?: string;
          photo_url?: string;
          profile_summary?: string;
          role?: string;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cohorts: {
        Row: {
          cohort_id: string;
          cohort_name: string;
          start_date: string;
          end_date: string;
          program_name?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cohort_id?: string;
          cohort_name: string;
          start_date: string;
          end_date: string;
          program_name?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          cohort_id?: string;
          cohort_name?: string;
          start_date?: string;
          end_date?: string;
          program_name?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      candidate_cohorts: {
        Row: {
          candidate_id: string;
          cohort_id: string;
          enrollment_date?: string;
          completion_status?: string;
        };
        Insert: {
          candidate_id: string;
          cohort_id: string;
          enrollment_date?: string;
          completion_status?: string;
        };
        Update: {
          candidate_id?: string;
          cohort_id?: string;
          enrollment_date?: string;
          completion_status?: string;
        };
      };
      exams: {
        Row: {
          exam_id: string;
          title: string;
          description?: string;
          exam_date: string;
          duration_minutes?: number;
          max_score?: number;
          passing_score?: number;
          created_at: string;
        };
        Insert: {
          exam_id?: string;
          title: string;
          description?: string;
          exam_date: string;
          duration_minutes?: number;
          max_score?: number;
          passing_score?: number;
          created_at?: string;
        };
        Update: {
          exam_id?: string;
          title?: string;
          description?: string;
          exam_date?: string;
          duration_minutes?: number;
          max_score?: number;
          passing_score?: number;
          created_at?: string;
        };
      };
      exam_results: {
        Row: {
          result_id: string;
          candidate_id?: string;
          exam_id?: string;
          score: number;
          max_score?: number;
          result_status?: string;
          result_date: string;
          feedback?: string;
          created_at: string;
        };
        Insert: {
          result_id?: string;
          candidate_id?: string;
          exam_id?: string;
          score: number;
          max_score?: number;
          result_status?: string;
          result_date: string;
          feedback?: string;
          created_at?: string;
        };
        Update: {
          result_id?: string;
          candidate_id?: string;
          exam_id?: string;
          score?: number;
          max_score?: number;
          result_status?: string;
          result_date?: string;
          feedback?: string;
          created_at?: string;
        };
      };
      surveys: {
        Row: {
          survey_id: string;
          title: string;
          survey_type: string;
          description?: string;
          max_rating?: number;
          date_created?: string;
          is_active?: boolean;
          created_at: string;
        };
        Insert: {
          survey_id?: string;
          title: string;
          survey_type: string;
          description?: string;
          max_rating?: number;
          date_created?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          survey_id?: string;
          title?: string;
          survey_type?: string;
          description?: string;
          max_rating?: number;
          date_created?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      survey_responses: {
        Row: {
          response_id: string;
          candidate_id?: string;
          survey_id?: string;
          rating?: number;
          feedback?: string;
          reviewer_name?: string;
          submitted_at: string;
        };
        Insert: {
          response_id?: string;
          candidate_id?: string;
          survey_id?: string;
          rating?: number;
          feedback?: string;
          reviewer_name?: string;
          submitted_at?: string;
        };
        Update: {
          response_id?: string;
          candidate_id?: string;
          survey_id?: string;
          rating?: number;
          feedback?: string;
          reviewer_name?: string;
          submitted_at?: string;
        };
      };
      events_hackathons: {
        Row: {
          event_id: string;
          title: string;
          description?: string;
          event_type?: string;
          event_date: string;
          location?: string;
          resources_url?: string;
          created_at: string;
        };
        Insert: {
          event_id?: string;
          title: string;
          description?: string;
          event_type?: string;
          event_date: string;
          location?: string;
          resources_url?: string;
          created_at?: string;
        };
        Update: {
          event_id?: string;
          title?: string;
          description?: string;
          event_type?: string;
          event_date?: string;
          location?: string;
          resources_url?: string;
          created_at?: string;
        };
      };
      candidate_events: {
        Row: {
          candidate_id: string;
          event_id: string;
          participation_role?: string;
          attendance_status?: string;
          notes?: string;
        };
        Insert: {
          candidate_id: string;
          event_id: string;
          participation_role?: string;
          attendance_status?: string;
          notes?: string;
        };
        Update: {
          candidate_id?: string;
          event_id?: string;
          participation_role?: string;
          attendance_status?: string;
          notes?: string;
        };
      };
      certificates: {
        Row: {
          certificate_id: string;
          candidate_id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiration_date?: string;
          certificate_url?: string;
          verification_code?: string;
          created_at: string;
        };
        Insert: {
          certificate_id?: string;
          candidate_id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiration_date?: string;
          certificate_url?: string;
          verification_code?: string;
          created_at?: string;
        };
        Update: {
          certificate_id?: string;
          candidate_id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string;
          expiration_date?: string;
          certificate_url?: string;
          verification_code?: string;
          created_at?: string;
        };
      };
      technical_feedback: {
        Row: {
          feedback_id: string;
          candidate_id?: string;
          mentor_name: string;
          feedback_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          feedback_id?: string;
          candidate_id?: string;
          mentor_name: string;
          feedback_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          feedback_id?: string;
          candidate_id?: string;
          mentor_name?: string;
          feedback_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}