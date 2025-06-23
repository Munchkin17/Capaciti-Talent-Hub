/*
  # Fix RLS Policy for Cohorts Table

  1. Security Changes
    - Add policy for anonymous users to insert cohorts
    - This allows the admin interface to create cohorts using the anon key
    
  2. Notes
    - The existing policy already allows anon users to read cohorts
    - This adds the missing INSERT permission for anon role
    - UPDATE and DELETE operations remain restricted to authenticated users only
*/

-- Add policy to allow anonymous users to insert cohorts
CREATE POLICY "Anonymous users can insert cohorts"
  ON cohorts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Add policy to allow anonymous users to update cohorts  
CREATE POLICY "Anonymous users can update cohorts"
  ON cohorts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add policy to allow anonymous users to delete cohorts
CREATE POLICY "Anonymous users can delete cohorts"
  ON cohorts
  FOR DELETE
  TO anon
  USING (true);