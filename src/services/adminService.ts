import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Candidate Management
export const candidateService = {
  async getAll() {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        candidate_cohorts (
          cohort_id,
          enrollment_date,
          completion_status,
          cohorts (
            cohort_id,
            cohort_name,
            program_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        candidate_cohorts (
          cohort_id,
          enrollment_date,
          completion_status,
          cohorts (*)
        ),
        exam_results (
          *,
          exams (*)
        ),
        survey_responses (
          *,
          surveys (*)
        ),
        candidate_events (
          *,
          events_hackathons (*)
        ),
        certificates (*)
      `)
      .eq('candidate_id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(candidate: Tables['candidates']['Insert']) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['candidates']['Update']) {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('candidate_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('candidate_id', id);

    if (error) throw error;
  },

  async assignToCohort(candidateId: string, cohortId: string) {
    const { data, error } = await supabase
      .from('candidate_cohorts')
      .insert({
        candidate_id: candidateId,
        cohort_id: cohortId,
        enrollment_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCohort(candidateId: string, cohortId: string) {
    const { error } = await supabase
      .from('candidate_cohorts')
      .delete()
      .eq('candidate_id', candidateId)
      .eq('cohort_id', cohortId);

    if (error) throw error;
  },

  async generateAIProfile(candidateId: string) {
    // Get candidate data with all related information
    const candidate = await this.getById(candidateId);
    
    // Generate AI summary based on performance data
    const examScores = candidate.exam_results?.map(r => r.score) || [];
    const surveyRatings = candidate.survey_responses?.map(r => r.rating).filter(Boolean) || [];
    
    const avgExamScore = examScores.length > 0
      ? Math.round(examScores.reduce((sum, score) => sum + score, 0) / examScores.length)
      : 0;
    
    const avgSurveyRating = surveyRatings.length > 0
      ? (surveyRatings.reduce((sum, rating) => sum + rating, 0) / surveyRatings.length).toFixed(1)
      : '0';

    const cohortInfo = candidate.candidate_cohorts?.[0]?.cohorts;
    const certificateCount = candidate.certificates?.length || 0;
    
    const aiSummary = `${candidate.full_name} is a ${candidate.role || 'professional'} who completed the ${cohortInfo?.program_name || 'training program'} as part of ${cohortInfo?.cohort_name || 'their cohort'}. ` +
      `${examScores.length > 0 ? `They demonstrated strong performance with an average exam score of ${avgExamScore}%. ` : ''}` +
      `${surveyRatings.length > 0 ? `Team leaders rated their overall performance at ${avgSurveyRating}/5.0. ` : ''}` +
      `${certificateCount > 0 ? `They hold ${certificateCount} professional certification${certificateCount > 1 ? 's' : ''}. ` : ''}` +
      `${candidate.linkedin_url ? 'Professional LinkedIn profile available. ' : ''}` +
      `${candidate.github_url ? 'Active GitHub portfolio showcasing technical projects. ' : ''}` +
      `${candidate.portfolio_url ? 'Personal portfolio website demonstrates their work and capabilities.' : ''}`;

    // Update candidate with AI-generated summary
    return await this.update(candidateId, { profile_summary: aiSummary });
  }
};

// Cohort Management
export const cohortService = {
  async getAll() {
    const { data, error } = await supabase
      .from('cohorts')
      .select(`
        *,
        candidate_cohorts (
          candidate_id,
          candidates (
            candidate_id,
            full_name,
            email,
            role
          )
        )
      `)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(cohort: Tables['cohorts']['Insert']) {
    const { data, error } = await supabase
      .from('cohorts')
      .insert(cohort)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['cohorts']['Update']) {
    const { data, error } = await supabase
      .from('cohorts')
      .update(updates)
      .eq('cohort_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('cohorts')
      .delete()
      .eq('cohort_id', id);

    if (error) throw error;
  },

  async findByName(cohortName: string) {
    const { data, error } = await supabase
      .from('cohorts')
      .select('*')
      .eq('cohort_name', cohortName)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }
};

// Technical Feedback Management
export const technicalFeedbackService = {
  async getByCandidateId(candidateId: string) {
    const { data, error } = await supabase
      .from('technical_feedback')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(feedback: Tables['technical_feedback']['Insert']) {
    const { data, error } = await supabase
      .from('technical_feedback')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['technical_feedback']['Update']) {
    const { data, error } = await supabase
      .from('technical_feedback')
      .update(updates)
      .eq('feedback_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('technical_feedback')
      .delete()
      .eq('feedback_id', id);

    if (error) throw error;
  }
};

// Challenge Management
export const challengeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        challenge_results (
          result_id,
          candidate_id,
          score,
          max_score,
          feedback,
          submitted_at,
          graded_at,
          graded_by,
          candidates (
            candidate_id,
            full_name,
            email
          )
        )
      `)
      .order('date_assigned', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(challenge: Tables['challenges']['Insert']) {
    const { data, error } = await supabase
      .from('challenges')
      .insert(challenge)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['challenges']['Update']) {
    const { data, error } = await supabase
      .from('challenges')
      .update(updates)
      .eq('challenge_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('challenge_id', id);

    if (error) throw error;
  }
};

// Hook to get challenges with results
export function useChallengesWithResults() {
  return challengeService.getAll();
}

// Exam Management
export const examService = {
  async getAll() {
    const { data, error } = await supabase
      .from('exams')
      .select(`
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
      `)
      .order('exam_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(exam: Tables['exams']['Insert']) {
    const { data, error } = await supabase
      .from('exams')
      .insert(exam)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['exams']['Update']) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('exam_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('exam_id', id);

    if (error) throw error;
  },

  async addResult(result: Tables['exam_results']['Insert']) {
    const { data, error } = await supabase
      .from('exam_results')
      .insert(result)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateResult(id: string, updates: Tables['exam_results']['Update']) {
    const { data, error } = await supabase
      .from('exam_results')
      .update(updates)
      .eq('result_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteResult(id: string) {
    const { error } = await supabase
      .from('exam_results')
      .delete()
      .eq('result_id', id);

    if (error) throw error;
  }
};

// Survey Management
export const surveyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('surveys')
      .select(`
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
      `)
      .order('date_created', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(survey: Tables['surveys']['Insert']) {
    const { data, error } = await supabase
      .from('surveys')
      .insert(survey)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['surveys']['Update']) {
    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('survey_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('survey_id', id);

    if (error) throw error;
  },

  async addResponse(response: Tables['survey_responses']['Insert']) {
    const { data, error } = await supabase
      .from('survey_responses')
      .insert(response)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateResponse(id: string, updates: Tables['survey_responses']['Update']) {
    const { data, error } = await supabase
      .from('survey_responses')
      .update(updates)
      .eq('response_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteResponse(id: string) {
    const { error } = await supabase
      .from('survey_responses')
      .delete()
      .eq('response_id', id);

    if (error) throw error;
  }
};

// Event Management
export const eventService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events_hackathons')
      .select(`
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
      `)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(event: Tables['events_hackathons']['Insert']) {
    const { data, error } = await supabase
      .from('events_hackathons')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['events_hackathons']['Update']) {
    const { data, error } = await supabase
      .from('events_hackathons')
      .update(updates)
      .eq('event_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events_hackathons')
      .delete()
      .eq('event_id', id);

    if (error) throw error;
  },

  async assignCandidate(candidateId: string, eventId: string, role: string = 'participant') {
    const { data, error } = await supabase
      .from('candidate_events')
      .insert({
        candidate_id: candidateId,
        event_id: eventId,
        participation_role: role,
        attendance_status: 'registered'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateParticipation(candidateId: string, eventId: string, updates: Tables['candidate_events']['Update']) {
    const { data, error } = await supabase
      .from('candidate_events')
      .update(updates)
      .eq('candidate_id', candidateId)
      .eq('event_id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeCandidate(candidateId: string, eventId: string) {
    const { error } = await supabase
      .from('candidate_events')
      .delete()
      .eq('candidate_id', candidateId)
      .eq('event_id', eventId);

    if (error) throw error;
  }
};

// Certificate Management
export const certificateService = {
  async getAll() {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        candidates (
          candidate_id,
          full_name,
          email
        )
      `)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(certificate: Tables['certificates']['Insert']) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['certificates']['Update']) {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('certificate_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('certificate_id', id);

    if (error) throw error;
  }
};

// Improved CSV parsing function
function parseCSV(text: string): any[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const result: any[] = [];
  const headers = parseCSVLine(lines[0]);
  
  if (headers.length === 0) {
    throw new Error('CSV file has no headers');
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    try {
      const values = parseCSVLine(line);
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      result.push(row);
    } catch (error) {
      throw new Error(`Error parsing line ${i + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`);
    }
  }

  return result;
}

// Parse a single CSV line handling quoted fields and escaped quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());
  
  return result;
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function validateInteger(value: string): boolean {
  return !isNaN(parseInt(value)) && isFinite(parseInt(value));
}

function validateSkillLevel(skillLevel: string): boolean {
  return ['beginner', 'intermediate', 'advanced'].includes(skillLevel.toLowerCase());
}

function validateSurveyType(surveyType: string): boolean {
  return ['leadership', 'collaboration', 'technical', 'overall', 'challenge', 'rating'].includes(surveyType.toLowerCase());
}

function validateResultStatus(status: string): boolean {
  return ['pending', 'passed', 'failed'].includes(status.toLowerCase());
}

// Import Service
export const importService = {
  async previewFile(file: File, importType: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseCSV(text);
          
          if (data.length === 0) {
            reject(new Error('CSV file contains no data rows'));
            return;
          }

          // Return first 5 rows for preview
          resolve(data.slice(0, 5));
        } catch (error) {
          reject(new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  async importData(file: File, importType: string): Promise<{ imported: number; errors: number; errorDetails: string[] }> {
    const data = await this.parseFile(file);
    let imported = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 because we skip header and arrays are 0-indexed
      
      try {
        if (importType === 'candidates') {
          await this.importCandidate(row, rowNumber);
        } else if (importType === 'exam_results') {
          await this.importExamResult(row, rowNumber);
        } else if (importType === 'survey_responses') {
          await this.importSurveyResponse(row, rowNumber);
        }
        imported++;
      } catch (error) {
        errors++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errorDetails.push(`Row ${rowNumber}: ${errorMessage}`);
      }
    }

    return { imported, errors, errorDetails };
  },

  async parseFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseCSV(text);
          resolve(data);
        } catch (error) {
          reject(new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  async importCandidate(row: any, rowNumber: number) {
    // Validate required fields
    if (!row.full_name || !row.full_name.trim()) {
      throw new Error('Missing required field: full_name');
    }
    
    if (!row.email || !row.email.trim()) {
      throw new Error('Missing required field: email');
    }
    
    if (!validateEmail(row.email)) {
      throw new Error(`Invalid email format: ${row.email}`);
    }

    // Validate optional fields
    if (row.skill_level && !validateSkillLevel(row.skill_level)) {
      throw new Error(`Invalid skill_level: ${row.skill_level}. Must be one of: beginner, intermediate, advanced`);
    }

    const candidateData: Tables['candidates']['Insert'] = {
      full_name: row.full_name.trim(),
      email: row.email.trim().toLowerCase(),
      phone: row.phone?.trim() || null,
      linkedin_url: row.linkedin_url?.trim() || null,
      github_url: row.github_url?.trim() || null,
      portfolio_url: row.portfolio_url?.trim() || null,
      resume_url: row.resume_url?.trim() || null,
      photo_url: row.photo_url?.trim() || null,
      role: row.role?.trim() || null,
      skill_level: row.skill_level?.toLowerCase() || null,
      is_public: row.is_public === 'true' || row.is_public === '1' || row.is_public === 'TRUE'
    };

    try {
      const newCandidate = await candidateService.create(candidateData);
      
      // Handle cohort assignment if cohort_name or cohort_id is provided
      if (row.cohort_name || row.cohort_id) {
        let cohortId = row.cohort_id;
        
        // If cohort_name is provided, find the cohort by name
        if (row.cohort_name && !cohortId) {
          const cohort = await cohortService.findByName(row.cohort_name.trim());
          if (cohort) {
            cohortId = cohort.cohort_id;
          } else {
            throw new Error(`Cohort not found: ${row.cohort_name}`);
          }
        }
        
        // Assign candidate to cohort
        if (cohortId) {
          await candidateService.assignToCohort(newCandidate.candidate_id, cohortId);
        }
      }
      
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error(`Email already exists: ${row.email}`);
      }
      throw new Error(`Database error: ${error.message}`);
    }
  },

  async importExamResult(row: any, rowNumber: number) {
    // Validate required fields
    if (!row.candidate_email || !row.candidate_email.trim()) {
      throw new Error('Missing required field: candidate_email');
    }
    
    if (!row.exam_title || !row.exam_title.trim()) {
      throw new Error('Missing required field: exam_title');
    }
    
    if (!row.score || !validateInteger(row.score)) {
      throw new Error(`Invalid score: ${row.score}. Must be a valid integer`);
    }
    
    if (!row.result_date || !validateDate(row.result_date)) {
      throw new Error(`Invalid result_date: ${row.result_date}. Must be a valid date (YYYY-MM-DD)`);
    }

    // Validate optional fields
    if (row.max_score && !validateInteger(row.max_score)) {
      throw new Error(`Invalid max_score: ${row.max_score}. Must be a valid integer`);
    }
    
    if (row.result_status && !validateResultStatus(row.result_status)) {
      throw new Error(`Invalid result_status: ${row.result_status}. Must be one of: pending, passed, failed`);
    }

    // Find candidate by email
    const { data: candidates, error: candidateError } = await supabase
      .from('candidates')
      .select('candidate_id')
      .eq('email', row.candidate_email.trim().toLowerCase())
      .single();

    if (candidateError || !candidates) {
      throw new Error(`Candidate not found with email: ${row.candidate_email}`);
    }

    // Create or find exam
    let exam;
    const { data: existingExam } = await supabase
      .from('exams')
      .select('exam_id')
      .eq('title', row.exam_title.trim())
      .single();

    if (existingExam) {
      exam = existingExam;
    } else {
      try {
        const { data: newExam, error: examError } = await supabase
          .from('exams')
          .insert({
            title: row.exam_title.trim(),
            exam_date: row.result_date,
            max_score: parseInt(row.max_score) || 100
          })
          .select('exam_id')
          .single();
        
        if (examError) throw examError;
        exam = newExam;
      } catch (error: any) {
        throw new Error(`Failed to create exam: ${error.message}`);
      }
    }

    // Create exam result
    try {
      await examService.addResult({
        candidate_id: candidates.candidate_id,
        exam_id: exam.exam_id,
        score: parseInt(row.score),
        max_score: parseInt(row.max_score) || 100,
        result_status: row.result_status?.toLowerCase() || 'pending',
        result_date: row.result_date,
        feedback: row.feedback?.trim() || null
      });
    } catch (error: any) {
      throw new Error(`Failed to create exam result: ${error.message}`);
    }
  },

  async importSurveyResponse(row: any, rowNumber: number) {
    // Validate required fields
    if (!row.candidate_email || !row.candidate_email.trim()) {
      throw new Error('Missing required field: candidate_email');
    }
    
    if (!row.survey_type || !row.survey_type.trim()) {
      throw new Error('Missing required field: survey_type');
    }
    
    if (!row.rating || !validateInteger(row.rating)) {
      throw new Error(`Invalid rating: ${row.rating}. Must be a valid integer`);
    }

    // Validate field values
    if (!validateSurveyType(row.survey_type)) {
      throw new Error(`Invalid survey_type: ${row.survey_type}. Must be one of: leadership, collaboration, technical, overall, challenge, rating`);
    }

    const rating = parseInt(row.rating);
    if (rating < 1 || rating > 5) {
      throw new Error(`Invalid rating: ${rating}. Must be between 1 and 5`);
    }

    if (row.submitted_at && !validateDate(row.submitted_at)) {
      throw new Error(`Invalid submitted_at: ${row.submitted_at}. Must be a valid date`);
    }

    // Find candidate by email
    const { data: candidates, error: candidateError } = await supabase
      .from('candidates')
      .select('candidate_id')
      .eq('email', row.candidate_email.trim().toLowerCase())
      .single();

    if (candidateError || !candidates) {
      throw new Error(`Candidate not found with email: ${row.candidate_email}`);
    }

    // Create or find survey
    let survey;
    const surveyTitle = `${row.survey_type.trim()} Survey`;
    const { data: existingSurvey } = await supabase
      .from('surveys')
      .select('survey_id')
      .eq('title', surveyTitle)
      .eq('survey_type', row.survey_type.trim().toLowerCase())
      .single();

    if (existingSurvey) {
      survey = existingSurvey;
    } else {
      try {
        const { data: newSurvey, error: surveyError } = await supabase
          .from('surveys')
          .insert({
            title: surveyTitle,
            survey_type: row.survey_type.trim().toLowerCase(),
            max_rating: 5
          })
          .select('survey_id')
          .single();
        
        if (surveyError) throw surveyError;
        survey = newSurvey;
      } catch (error: any) {
        throw new Error(`Failed to create survey: ${error.message}`);
      }
    }

    // Create survey response
    try {
      await surveyService.addResponse({
        candidate_id: candidates.candidate_id,
        survey_id: survey.survey_id,
        rating: rating,
        feedback: row.feedback?.trim() || null,
        reviewer_name: row.reviewer_name?.trim() || null,
        submitted_at: row.submitted_at || new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to create survey response: ${error.message}`);
    }
  },

  generateTemplate(importType: string): string {
    const templates = {
      candidates: 'full_name,email,phone,linkedin_url,github_url,portfolio_url,resume_url,photo_url,role,skill_level,is_public,cohort_name\n"John Doe","john@example.com","+1234567890","https://linkedin.com/in/johndoe","https://github.com/johndoe","https://johndoe.dev","https://example.com/resume.pdf","https://example.com/photo.jpg","Full-Stack Developer","intermediate","true","Tech Accelerator 2025-Q1"',
      exam_results: 'candidate_email,exam_title,score,max_score,result_status,result_date,feedback\n"john@example.com","Final Technical Exam","85","100","passed","2025-01-15","Excellent performance"',
      survey_responses: 'candidate_email,survey_type,rating,feedback,reviewer_name,submitted_at\n"john@example.com","technical","4","Great technical skills","Jane Smith","2025-01-15T10:00:00Z"'
    };

    return templates[importType as keyof typeof templates] || '';
  },

  downloadTemplate(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Data Import/Export
export const dataService = {
  async exportCandidates() {
    const candidates = await candidateService.getAll();
    return this.convertToCSV(candidates, 'candidates');
  },

  async exportCohorts() {
    const cohorts = await cohortService.getAll();
    return this.convertToCSV(cohorts, 'cohorts');
  },

  async exportExams() {
    const exams = await examService.getAll();
    return this.convertToCSV(exams, 'exams');
  },

  async exportChallenges() {
    const challenges = await challengeService.getAll();
    return this.convertToCSV(challenges, 'challenges');
  },

  async exportSurveys() {
    const surveys = await surveyService.getAll();
    return this.convertToCSV(surveys, 'surveys');
  },

  async exportEvents() {
    const events = await eventService.getAll();
    return this.convertToCSV(events, 'events');
  },

  async exportCertificates() {
    const certificates = await certificateService.getAll();
    return this.convertToCSV(certificates, 'certificates');
  },

  convertToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) {
      return { csv: '', filename: `${filename}_${new Date().toISOString().split('T')[0]}.csv` };
    }

    // Get headers from first object, excluding nested objects
    const headers = Object.keys(data[0]).filter(key => 
      typeof data[0][key] !== 'object' || data[0][key] === null
    );

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    return {
      csv: csvContent,
      filename: `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    };
  },

  downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};