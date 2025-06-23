import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseData<T>(
  table: string,
  select: string = '*',
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error: fetchError } = await supabase
        .from(table)
        .select(select);

      if (fetchError) {
        throw fetchError;
      }

      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useCandidatesWithCohorts() {
  return useSupabaseData(
    'candidates',
    `
      *,
      candidate_cohorts (
        cohort_id,
        enrollment_date,
        completion_status,
        cohorts (
          cohort_id,
          cohort_name,
          program_name,
          start_date,
          end_date
        )
      )
    `
  );
}

export function useCohortsWithCandidates() {
  return useSupabaseData(
    'cohorts',
    `
      *,
      candidate_cohorts (
        candidate_id,
        enrollment_date,
        completion_status,
        candidates (
          candidate_id,
          full_name,
          email,
          role
        )
      )
    `
  );
}

export function useExamsWithResults() {
  return useSupabaseData(
    'exams',
    `
      *,
      exam_results (
        result_id,
        candidate_id,
        score,
        max_score,
        result_status,
        result_date,
        feedback,
        candidates (
          candidate_id,
          full_name,
          email
        )
      )
    `
  );
}

export function useSurveysWithResponses() {
  return useSupabaseData(
    'surveys',
    `
      *,
      survey_responses (
        response_id,
        candidate_id,
        rating,
        feedback,
        reviewer_name,
        submitted_at,
        candidates (
          candidate_id,
          full_name,
          email
        )
      )
    `
  );
}

export function useEventsWithParticipants() {
  return useSupabaseData(
    'events_hackathons',
    `
      *,
      candidate_events (
        candidate_id,
        participation_role,
        attendance_status,
        notes,
        candidates (
          candidate_id,
          full_name,
          email
        )
      )
    `
  );
}

export function useCertificatesWithCandidates() {
  return useSupabaseData(
    'certificates',
    `
      *,
      candidates (
        candidate_id,
        full_name,
        email
      )
    `
  );
}