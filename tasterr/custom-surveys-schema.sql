-- Custom Surveys Schema Extension for Tasterr

-- Create custom_surveys table
CREATE TABLE custom_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  introduction TEXT NOT NULL,
  created_by TEXT NOT NULL, -- admin user_id who created the survey
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'new_users', 'existing_users')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create survey_questions table
CREATE TABLE survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES custom_surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_subtitle TEXT,
  question_type TEXT NOT NULL CHECK (question_type IN ('input', 'select', 'radio', 'textarea', 'number')),
  options JSONB, -- Store options for select/radio questions as JSON array
  is_required BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(survey_id, order_index)
);

-- Create survey_responses table
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES custom_surveys(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  response_data JSONB NOT NULL, -- Store all answers as JSON object
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(survey_id, user_id) -- One response per user per survey
);

-- Create RLS policies for custom_surveys
ALTER TABLE custom_surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published surveys
CREATE POLICY "Anyone can view published surveys" ON custom_surveys
  FOR SELECT USING (status = 'published' AND (expires_at IS NULL OR expires_at > now()));

-- Policy: Admins can manage all surveys (handled by service role)
-- No policy needed as admin operations use service role

-- Create RLS policies for survey_questions
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view questions for published surveys
CREATE POLICY "Users can view questions for published surveys" ON survey_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM custom_surveys cs 
      WHERE cs.id = survey_questions.survey_id 
      AND cs.status = 'published' 
      AND (cs.expires_at IS NULL OR cs.expires_at > now())
    )
  );

-- Create RLS policies for survey_responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own responses
CREATE POLICY "Users can insert own survey responses" ON survey_responses
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can view their own responses
CREATE POLICY "Users can view own survey responses" ON survey_responses
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can update their own responses
CREATE POLICY "Users can update own survey responses" ON survey_responses
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_custom_surveys_updated_at BEFORE UPDATE
ON custom_surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_custom_surveys_status ON custom_surveys(status);
CREATE INDEX idx_custom_surveys_created_by ON custom_surveys(created_by);
CREATE INDEX idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX idx_survey_questions_order ON survey_questions(survey_id, order_index);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);

-- Insert sample custom survey for testing
INSERT INTO custom_surveys (
  title,
  description, 
  introduction,
  created_by,
  status
) VALUES (
  'Product Feedback Survey',
  'Help us improve our products by sharing your experience',
  'We value your opinion! This quick survey will help us understand your preferences and improve our products. It should take about 3-5 minutes to complete.',
  'admin-sample-id',
  'published'
);

-- Insert sample questions for the survey
WITH survey AS (
  SELECT id FROM custom_surveys WHERE title = 'Product Feedback Survey' LIMIT 1
)
INSERT INTO survey_questions (survey_id, question_text, question_subtitle, question_type, is_required, order_index, options)
SELECT 
  survey.id,
  unnest(ARRAY[
    'How satisfied are you with our products?',
    'Which product category interests you most?',
    'How did you hear about us?',
    'Any additional feedback?'
  ]),
  unnest(ARRAY[
    'Please rate your overall satisfaction',
    'Select the category that appeals to you',
    'Help us understand our reach',
    'Optional - share any thoughts or suggestions'
  ]),
  unnest(ARRAY['radio', 'select', 'radio', 'textarea']::text[]),
  unnest(ARRAY[true, true, true, false]::boolean[]),
  unnest(ARRAY[1, 2, 3, 4]),
  unnest(ARRAY[
    '[{"value": "very-satisfied", "label": "Very Satisfied"}, {"value": "satisfied", "label": "Satisfied"}, {"value": "neutral", "label": "Neutral"}, {"value": "dissatisfied", "label": "Dissatisfied"}, {"value": "very-dissatisfied", "label": "Very Dissatisfied"}]'::jsonb,
    '[{"value": "beverages", "label": "Beverages"}, {"value": "snacks", "label": "Snacks"}, {"value": "packaged-foods", "label": "Packaged Foods"}, {"value": "health-foods", "label": "Health Foods"}]'::jsonb,
    '[{"value": "social-media", "label": "Social Media"}, {"value": "friend-referral", "label": "Friend Referral"}, {"value": "online-search", "label": "Online Search"}, {"value": "advertisement", "label": "Advertisement"}, {"value": "other", "label": "Other"}]'::jsonb,
    NULL
  ]::jsonb[])
FROM survey;