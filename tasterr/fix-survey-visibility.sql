-- Fix survey visibility for users
-- This ensures that published surveys are visible to all authenticated users

-- First, let's check if there are any conflicting policies
DROP POLICY IF EXISTS "Anyone can view published surveys" ON custom_surveys;
DROP POLICY IF EXISTS "Users can view questions for published surveys" ON survey_questions;

-- Recreate the policies with better logic
-- Policy: Authenticated users can view published, non-expired surveys
CREATE POLICY "Authenticated users can view published surveys" ON custom_surveys
  FOR SELECT 
  USING (
    auth.jwt() IS NOT NULL 
    AND status = 'published' 
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Policy: Authenticated users can view questions for published surveys
CREATE POLICY "Authenticated users can view published survey questions" ON survey_questions
  FOR SELECT 
  USING (
    auth.jwt() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM custom_surveys cs 
      WHERE cs.id = survey_questions.survey_id 
      AND cs.status = 'published' 
      AND (cs.expires_at IS NULL OR cs.expires_at > now())
    )
  );

-- Alternative: If JWT auth isn't working, we can make published surveys public
-- Uncomment these if the above doesn't work:

-- CREATE POLICY "Public can view published surveys" ON custom_surveys
--   FOR SELECT 
--   USING (
--     status = 'published' 
--     AND (expires_at IS NULL OR expires_at > now())
--   );

-- CREATE POLICY "Public can view published survey questions" ON survey_questions
--   FOR SELECT 
--   USING (
--     EXISTS (
--       SELECT 1 FROM custom_surveys cs 
--       WHERE cs.id = survey_questions.survey_id 
--       AND cs.status = 'published' 
--       AND (cs.expires_at IS NULL OR cs.expires_at > now())
--     )
--   );

-- Check if there are any published surveys
SELECT 
  id, 
  title, 
  status, 
  expires_at,
  created_at
FROM custom_surveys 
WHERE status = 'published';