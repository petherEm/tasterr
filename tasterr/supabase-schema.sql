-- Create user_surveys table
CREATE TABLE user_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  age TEXT,
  gender TEXT,
  city_size TEXT NOT NULL,
  shopping_frequency TEXT NOT NULL,
  preferred_brand TEXT,
  profession TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE user_surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own survey data
CREATE POLICY "Users can view own survey data" ON user_surveys
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can insert their own survey data
CREATE POLICY "Users can insert own survey data" ON user_surveys
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can update their own survey data
CREATE POLICY "Users can update own survey data" ON user_surveys
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_surveys_updated_at BEFORE UPDATE
ON user_surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create research_surveys table
CREATE TABLE research_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  survey_type TEXT NOT NULL CHECK (survey_type IN ('beer', 'snacks')),
  survey_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, survey_type)
);

-- Create RLS policies for research_surveys
ALTER TABLE research_surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own research survey data
CREATE POLICY "Users can view own research survey data" ON research_surveys
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can insert their own research survey data
CREATE POLICY "Users can insert own research survey data" ON research_surveys
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Policy: Users can update their own research survey data
CREATE POLICY "Users can update own research survey data" ON research_surveys
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- Create updated_at trigger for research_surveys
CREATE TRIGGER update_research_surveys_updated_at BEFORE UPDATE
ON research_surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();