/*
  # CAPACITI TALENT HUB Database Schema

  1. New Tables
    - `candidates` - Core candidate information with profile data
    - `cohorts` - Training cohort details and schedules
    - `candidate_cohorts` - Many-to-many relationship between candidates and cohorts
    - `challenges` - Daily/weekly challenges and tasks
    - `challenge_results` - Candidate performance on challenges
    - `exams` - Formal examinations and assessments
    - `exam_results` - Candidate exam scores and results
    - `surveys` - Feedback surveys and rating forms
    - `survey_responses` - Candidate survey submissions
    - `events_hackathons` - Events, hackathons, and special activities
    - `candidate_events` - Candidate participation in events
    - `certificates` - Professional certifications and achievements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Add policies for public read access where appropriate

  3. Features
    - UUID primary keys for scalability
    - Proper foreign key relationships
    - Timestamps for audit trails
    - Indexes on frequently queried fields
    - Nullable fields where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COHORTS TABLE
CREATE TABLE IF NOT EXISTS cohorts (
  cohort_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_name varchar(255) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  program_name varchar(255),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. CANDIDATES TABLE
CREATE TABLE IF NOT EXISTS candidates (
  candidate_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  phone varchar(50),
  linkedin_url varchar(500),
  github_url varchar(500),
  portfolio_url varchar(500),
  resume_url varchar(500),
  photo_url varchar(500),
  profile_summary text,
  role varchar(255),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. CANDIDATE_COHORTS (Many-to-Many Bridge Table)
CREATE TABLE IF NOT EXISTS candidate_cohorts (
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES cohorts(cohort_id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  completion_status varchar(50) DEFAULT 'active',
  PRIMARY KEY (candidate_id, cohort_id)
);

-- 4. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS challenges (
  challenge_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  description text,
  topic varchar(255),
  max_score integer DEFAULT 100,
  date_assigned date NOT NULL,
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- 5. CHALLENGE_RESULTS TABLE
CREATE TABLE IF NOT EXISTS challenge_results (
  result_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(challenge_id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0),
  max_score integer DEFAULT 100,
  feedback text,
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  graded_by varchar(255)
);

-- 6. EXAMS TABLE
CREATE TABLE IF NOT EXISTS exams (
  exam_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  description text,
  exam_date date NOT NULL,
  duration_minutes integer,
  max_score integer DEFAULT 100,
  passing_score integer DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

-- 7. EXAM_RESULTS TABLE
CREATE TABLE IF NOT EXISTS exam_results (
  result_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  exam_id uuid REFERENCES exams(exam_id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0),
  max_score integer DEFAULT 100,
  result_status varchar(50) DEFAULT 'pending' CHECK (result_status IN ('pending', 'passed', 'failed')),
  result_date date NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- 8. SURVEYS TABLE
CREATE TABLE IF NOT EXISTS surveys (
  survey_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  survey_type varchar(100) NOT NULL CHECK (survey_type IN ('leadership', 'collaboration', 'technical', 'overall', 'challenge', 'rating')),
  description text,
  max_rating integer DEFAULT 5,
  date_created date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 9. SURVEY_RESPONSES TABLE
CREATE TABLE IF NOT EXISTS survey_responses (
  response_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  survey_id uuid REFERENCES surveys(survey_id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  reviewer_name varchar(255),
  submitted_at timestamptz DEFAULT now()
);

-- 10. EVENTS_HACKATHONS TABLE
CREATE TABLE IF NOT EXISTS events_hackathons (
  event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  description text,
  event_type varchar(100) DEFAULT 'event' CHECK (event_type IN ('event', 'hackathon', 'workshop', 'seminar', 'project')),
  event_date date NOT NULL,
  location varchar(255),
  resources_url varchar(500),
  created_at timestamptz DEFAULT now()
);

-- 11. CANDIDATE_EVENTS TABLE
CREATE TABLE IF NOT EXISTS candidate_events (
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  event_id uuid REFERENCES events_hackathons(event_id) ON DELETE CASCADE,
  participation_role varchar(255) DEFAULT 'participant',
  attendance_status varchar(50) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')),
  notes text,
  PRIMARY KEY (candidate_id, event_id)
);

-- 12. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
  certificate_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  issuer varchar(255) NOT NULL,
  issue_date date NOT NULL,
  expiration_date date,
  certificate_url varchar(500),
  verification_code varchar(255),
  created_at timestamptz DEFAULT now()
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_public ON candidates(is_public);
CREATE INDEX IF NOT EXISTS idx_candidate_cohorts_candidate ON candidate_cohorts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_cohorts_cohort ON candidate_cohorts(cohort_id);
CREATE INDEX IF NOT EXISTS idx_challenge_results_candidate ON challenge_results(candidate_id);
CREATE INDEX IF NOT EXISTS idx_challenge_results_challenge ON challenge_results(challenge_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_candidate ON exam_results(candidate_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_candidate ON survey_responses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_candidate_events_candidate ON candidate_events(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_events_event ON candidate_events(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_candidate ON certificates(candidate_id);

-- CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ADD UPDATED_AT TRIGGERS
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR AUTHENTICATED USERS (ADMIN ACCESS)
CREATE POLICY "Authenticated users can manage cohorts"
  ON cohorts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage candidates"
  ON candidates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage candidate_cohorts"
  ON candidate_cohorts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage challenges"
  ON challenges
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage challenge_results"
  ON challenge_results
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage exam_results"
  ON exam_results
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage surveys"
  ON surveys
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage survey_responses"
  ON survey_responses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage events_hackathons"
  ON events_hackathons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage candidate_events"
  ON candidate_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage certificates"
  ON certificates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS POLICIES FOR PUBLIC ACCESS (READ-ONLY FOR PUBLIC CANDIDATES)
CREATE POLICY "Public can read public candidates"
  ON candidates
  FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Public can read cohorts for public candidates"
  ON cohorts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read candidate_cohorts for public candidates"
  ON candidate_cohorts
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = candidate_cohorts.candidate_id 
      AND candidates.is_public = true
    )
  );

CREATE POLICY "Public can read challenge_results for public candidates"
  ON challenge_results
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = challenge_results.candidate_id 
      AND candidates.is_public = true
    )
  );

CREATE POLICY "Public can read challenges for public data"
  ON challenges
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read exam_results for public candidates"
  ON exam_results
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = exam_results.candidate_id 
      AND candidates.is_public = true
    )
  );

CREATE POLICY "Public can read exams for public data"
  ON exams
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read survey_responses for public candidates"
  ON survey_responses
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = survey_responses.candidate_id 
      AND candidates.is_public = true
    )
  );

CREATE POLICY "Public can read surveys for public data"
  ON surveys
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read candidate_events for public candidates"
  ON candidate_events
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = candidate_events.candidate_id 
      AND candidates.is_public = true
    )
  );

CREATE POLICY "Public can read events_hackathons for public data"
  ON events_hackathons
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read certificates for public candidates"
  ON certificates
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = certificates.candidate_id 
      AND candidates.is_public = true
    )
  );