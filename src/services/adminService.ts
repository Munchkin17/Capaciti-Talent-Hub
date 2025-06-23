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

// Import Service
export const importService = {
  async previewFile(file: File, importType: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            reject(new Error('File is empty'));
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const preview = lines.slice(1, 6).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });

          resolve(preview);
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  async importData(file: File, importType: string): Promise<{ imported: number; errors: number }> {
    const data = await this.parseFile(file);
    let imported = 0;
    let errors = 0;

    for (const row of data) {
      try {
        if (importType === 'candidates') {
          await this.importCandidate(row);
        } else if (importType === 'exam_results') {
          await this.importExamResult(row);
        } else if (importType === 'survey_responses') {
          await this.importSurveyResponse(row);
        }
        imported++;
      } catch (error) {
        console.error('Import error:', error);
        errors++;
      }
    }

    return { imported, errors };
  },

  async parseFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.readAsText(file);
    });
  },

  async importCandidate(row: any) {
    const candidateData: Tables['candidates']['Insert'] = {
      full_name: row.full_name,
      email: row.email,
      phone: row.phone || null,
      linkedin_url: row.linkedin_url || null,
      github_url: row.github_url || null,
      portfolio_url: row.portfolio_url || null,
      resume_url: row.resume_url || null,
      photo_url: row.photo_url || null,
      role: row.role || null,
      skill_level: row.skill_level || null,
      is_public: row.is_public === 'true' || row.is_public === '1'
    };

    await candidateService.create(candidateData);
  },

  async importExamResult(row: any) {
    // Find candidate by email
    const { data: candidates } = await supabase
      .from('candidates')
      .select('candidate_id')
      .eq('email', row.candidate_email)
      .single();

    if (!candidates) {
      throw new Error(`Candidate not found: ${row.candidate_email}`);
    }

    // Create or find exam
    let exam;
    const { data: existingExam } = await supabase
      .from('exams')
      .select('exam_id')
      .eq('title', row.exam_title)
      .single();

    if (existingExam) {
      exam = existingExam;
    } else {
      const { data: newExam } = await supabase
        .from('exams')
        .insert({
          title: row.exam_title,
          exam_date: row.result_date,
          max_score: parseInt(row.max_score) || 100
        })
        .select('exam_id')
        .single();
      exam = newExam;
    }

    // Create exam result
    await examService.addResult({
      candidate_id: candidates.candidate_id,
      exam_id: exam.exam_id,
      score: parseInt(row.score),
      max_score: parseInt(row.max_score) || 100,
      result_status: row.result_status || 'completed',
      result_date: row.result_date,
      feedback: row.feedback || null
    });
  },

  async importSurveyResponse(row: any) {
    // Find candidate by email
    const { data: candidates } = await supabase
      .from('candidates')
      .select('candidate_id')
      .eq('email', row.candidate_email)
      .single();

    if (!candidates) {
      throw new Error(`Candidate not found: ${row.candidate_email}`);
    }

    // Create or find survey
    let survey;
    const surveyTitle = `${row.survey_type} Survey`;
    const { data: existingSurvey } = await supabase
      .from('surveys')
      .select('survey_id')
      .eq('title', surveyTitle)
      .single();

    if (existingSurvey) {
      survey = existingSurvey;
    } else {
      const { data: newSurvey } = await supabase
        .from('surveys')
        .insert({
          title: surveyTitle,
          survey_type: row.survey_type,
          max_rating: 5
        })
        .select('survey_id')
        .single();
      survey = newSurvey;
    }

    // Create survey response
    await surveyService.addResponse({
      candidate_id: candidates.candidate_id,
      survey_id: survey.survey_id,
      rating: parseInt(row.rating),
      feedback: row.feedback || null,
      reviewer_name: row.reviewer_name || null,
      submitted_at: row.submitted_at || new Date().toISOString()
    });
  },

  generateTemplate(importType: string): string {
    const templates = {
      candidates: 'full_name,email,phone,linkedin_url,github_url,portfolio_url,resume_url,photo_url,role,skill_level,is_public\nJohn Doe,john@example.com,+1234567890,https://linkedin.com/in/johndoe,https://github.com/johndoe,https://johndoe.dev,https://example.com/resume.pdf,https://example.com/photo.jpg,Full-Stack Developer,intermediate,true',
      exam_results: 'candidate_email,exam_title,score,max_score,result_status,result_date,feedback\njohn@example.com,Final Technical Exam,85,100,passed,2025-01-15,Excellent performance',
      survey_responses: 'candidate_email,survey_type,rating,feedback,reviewer_name,submitted_at\njohn@example.com,technical,4,Great technical skills,Jane Smith,2025-01-15T10:00:00Z'
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