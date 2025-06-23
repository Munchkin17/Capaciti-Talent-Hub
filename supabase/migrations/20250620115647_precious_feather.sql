/*
  # Platform Updates for CAPACITI TALENT HUB

  1. Database Changes
    - Add skill_level column to candidates table
    - Create technical_feedback table for mentor feedback
    - Add indexes for performance

  2. Security
    - Enable RLS on technical_feedback table
    - Add policies for authenticated users and mentors
*/

-- Add skill_level column to candidates table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidates' AND column_name = 'skill_level'
  ) THEN
    ALTER TABLE candidates ADD COLUMN skill_level varchar(50) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced'));
  END IF;
END $$;

-- Create technical_feedback table
CREATE TABLE IF NOT EXISTS technical_feedback (
  feedback_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  mentor_name varchar(255) NOT NULL,
  feedback_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_technical_feedback_candidate ON technical_feedback(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidates_skill_level ON candidates(skill_level);

-- Add updated_at trigger for technical_feedback
CREATE TRIGGER update_technical_feedback_updated_at 
  BEFORE UPDATE ON technical_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on technical_feedback
ALTER TABLE technical_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for technical_feedback
CREATE POLICY "Authenticated users can manage technical_feedback"
  ON technical_feedback
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous users can read technical feedback for public candidates
CREATE POLICY "Public can read technical_feedback for public candidates"
  ON technical_feedback
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM candidates 
      WHERE candidates.candidate_id = technical_feedback.candidate_id 
      AND candidates.is_public = true
    )
  );

-- Add policies for anonymous users to manage technical_feedback (for admin interface)
CREATE POLICY "Anonymous users can insert technical_feedback"
  ON technical_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update technical_feedback"
  ON technical_feedback
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete technical_feedback"
  ON technical_feedback
  FOR DELETE
  TO anon
  USING (true);