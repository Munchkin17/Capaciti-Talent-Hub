import type { Database } from '../lib/supabase';
import { Candidate, CandidateProfile, Cohort, Skill, ChallengeResult, Exam, Certification, Survey, Event } from '../types';

type SupabaseCandidate = Database['public']['Tables']['candidates']['Row'] & {
  candidate_cohorts?: Array<{
    cohort_id: string;
    enrollment_date?: string;
    completion_status?: string;
    cohorts: Database['public']['Tables']['cohorts']['Row'];
  }>;
  challenge_results?: Array<Database['public']['Tables']['challenge_results']['Row'] & {
    challenges?: Database['public']['Tables']['challenges']['Row'];
  }>;
  exam_results?: Array<Database['public']['Tables']['exam_results']['Row'] & {
    exams?: Database['public']['Tables']['exams']['Row'];
  }>;
  survey_responses?: Array<Database['public']['Tables']['survey_responses']['Row'] & {
    surveys?: Database['public']['Tables']['surveys']['Row'];
  }>;
  candidate_events?: Array<Database['public']['Tables']['candidate_events']['Row'] & {
    events_hackathons?: Database['public']['Tables']['events_hackathons']['Row'];
  }>;
  certificates?: Array<Database['public']['Tables']['certificates']['Row']>;
};

export function transformSupabaseCandidateToCandidate(supabaseCandidate: SupabaseCandidate): Candidate {
  return {
    id: supabaseCandidate.candidate_id,
    fullName: supabaseCandidate.full_name,
    email: supabaseCandidate.email,
    cohortId: supabaseCandidate.candidate_cohorts?.[0]?.cohort_id || '',
    role: supabaseCandidate.role || 'Not specified',
    linkedinUrl: supabaseCandidate.linkedin_url,
    githubUrl: supabaseCandidate.github_url,
    portfolioUrl: supabaseCandidate.portfolio_url,
    resumeUrl: supabaseCandidate.resume_url,
    photoUrl: supabaseCandidate.photo_url,
    isPublic: supabaseCandidate.is_public,
    createdAt: new Date(supabaseCandidate.created_at),
    updatedAt: new Date(supabaseCandidate.updated_at)
  };
}

export function transformSupabaseCohortToCohort(supabaseCohort: Database['public']['Tables']['cohorts']['Row']): Cohort {
  return {
    id: supabaseCohort.cohort_id,
    name: supabaseCohort.cohort_name,
    startDate: new Date(supabaseCohort.start_date),
    endDate: new Date(supabaseCohort.end_date),
    programName: supabaseCohort.program_name || 'Unknown Program',
    candidateCount: 0, // This would need to be calculated separately
    avgPerformance: 0 // This would need to be calculated separately
  };
}

export function generateSkillsFromChallengeResults(challengeResults: Array<Database['public']['Tables']['challenge_results']['Row'] & {
  challenges?: Database['public']['Tables']['challenges']['Row'];
}>): Skill[] {
  const skillMap = new Map<string, { total: number, count: number, max: number }>();
  
  challengeResults.forEach(cr => {
    const topic = cr.challenges?.topic || 'General';
    if (!skillMap.has(topic)) {
      skillMap.set(topic, { total: 0, count: 0, max: 0 });
    }
    const skill = skillMap.get(topic)!;
    skill.total += cr.score;
    skill.count += 1;
    skill.max = Math.max(skill.max, cr.max_score || 100);
  });

  const skills = Array.from(skillMap.entries()).map(([name, data]) => ({
    name,
    level: Math.round(data.total / data.count),
    maxLevel: data.max
  }));

  // Add some default skills if no challenge results exist
  if (skills.length === 0) {
    skills.push(
      { name: 'Problem Solving', level: 75, maxLevel: 100 },
      { name: 'Team Collaboration', level: 80, maxLevel: 100 },
      { name: 'Communication', level: 85, maxLevel: 100 }
    );
  }

  return skills;
}

export function transformSupabaseCandidateToCandidateProfile(supabaseCandidate: SupabaseCandidate): CandidateProfile {
  const candidate = transformSupabaseCandidateToCandidate(supabaseCandidate);
  
  // Transform cohort
  const cohortData = supabaseCandidate.candidate_cohorts?.[0]?.cohorts;
  const cohort: Cohort = cohortData ? transformSupabaseCohortToCohort(cohortData) : {
    id: '',
    name: 'No Cohort Assigned',
    startDate: new Date(),
    endDate: new Date(),
    programName: 'Unknown Program',
    candidateCount: 0,
    avgPerformance: 0
  };

  // Transform challenge results
  const challengeResults: ChallengeResult[] = (supabaseCandidate.challenge_results || []).map(cr => ({
    id: cr.result_id,
    candidateId: cr.candidate_id || '',
    challengeTitle: cr.challenges?.title || 'Unknown Challenge',
    date: new Date(cr.submitted_at),
    score: cr.score,
    topic: cr.challenges?.topic || 'General',
    maxScore: cr.max_score || 100
  }));

  // Transform exams
  const exams: Exam[] = (supabaseCandidate.exam_results || []).map(er => ({
    id: er.result_id,
    candidateId: er.candidate_id || '',
    examName: er.exams?.title || 'Unknown Exam',
    dateTaken: new Date(er.result_date),
    score: er.score,
    maxScore: er.max_score || 100,
    result: er.result_status === 'passed' ? 'Passed' : er.result_status === 'failed' ? 'Failed' : 'Pending'
  }));

  // Transform certifications
  const certifications: Certification[] = (supabaseCandidate.certificates || []).map(cert => ({
    id: cert.certificate_id,
    candidateId: cert.candidate_id || '',
    certName: cert.title,
    provider: cert.issuer,
    issueDate: new Date(cert.issue_date),
    certUrl: cert.certificate_url,
    expirationDate: cert.expiration_date ? new Date(cert.expiration_date) : undefined
  }));

  // Transform surveys
  const surveys: Survey[] = (supabaseCandidate.survey_responses || []).map(sr => ({
    id: sr.response_id,
    candidateId: sr.candidate_id || '',
    surveyType: sr.surveys?.survey_type as 'leadership' | 'collaboration' | 'technical' | 'overall' || 'overall',
    rating: sr.rating || 0,
    comment: sr.feedback || '',
    date: new Date(sr.submitted_at),
    reviewerName: sr.reviewer_name || 'Anonymous'
  }));

  // Transform events
  const events: Event[] = (supabaseCandidate.candidate_events || []).map(ce => ({
    id: ce.event_id,
    candidateId: ce.candidate_id,
    eventName: ce.events_hackathons?.title || 'Unknown Event',
    role: ce.participation_role || 'Participant',
    date: new Date(ce.events_hackathons?.event_date || new Date()),
    resourcesUrl: ce.events_hackathons?.resources_url
  }));

  // Generate skills from challenge results
  const skills = generateSkillsFromChallengeResults(supabaseCandidate.challenge_results || []);

  // Calculate overall rating from surveys
  const overallRating = surveys.length > 0 ? 
    surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length : 4.5;

  // Generate AI summary
  const avgChallengeScore = challengeResults.length > 0 
    ? Math.round(challengeResults.reduce((sum, cr) => sum + cr.score, 0) / challengeResults.length)
    : 0;
  
  const passedExams = exams.filter(exam => exam.result === 'Passed').length;
  const avgSurveyRating = surveys.length > 0 
    ? (surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length).toFixed(1)
    : '0';

  const aiSummary = supabaseCandidate.profile_summary || 
    `${candidate.fullName} is a ${candidate.role} who completed the ${cohort.programName} as part of ${cohort.name}. ` +
    `${challengeResults.length > 0 ? `They demonstrated strong performance with an average challenge score of ${avgChallengeScore}%. ` : ''}` +
    `${exams.length > 0 ? `They have passed ${passedExams} exam${passedExams !== 1 ? 's' : ''}. ` : ''}` +
    `${surveys.length > 0 ? `Team leaders rated their overall performance at ${avgSurveyRating}/5.0. ` : ''}` +
    `${certifications.length > 0 ? `They hold ${certifications.length} professional certification${certifications.length > 1 ? 's' : ''}. ` : ''}` +
    `${candidate.linkedinUrl ? 'Professional LinkedIn profile available. ' : ''}` +
    `${candidate.githubUrl ? 'Active GitHub portfolio showcasing technical projects. ' : ''}` +
    `${candidate.portfolioUrl ? 'Personal portfolio website demonstrates their work and capabilities.' : ''}`;

  return {
    ...candidate,
    cohort,
    skills,
    challengeResults,
    exams,
    certifications,
    surveys,
    events,
    aiSummary,
    overallRating
  };
}