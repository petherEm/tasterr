export interface SurveyData {
  age?: string;
  gender?: string;
  citySize: string;
  shoppingFrequency: string;
  preferredBrand?: string;
  profession: string;
}

export interface UserSurvey {
  id?: string;
  user_id: string;
  age?: string;
  gender?: string;
  city_size: string;
  shopping_frequency: string;
  preferred_brand?: string;
  profession: string;
  created_at?: string;
  updated_at?: string;
}

export interface BeerSurveyData {
  beer_preference: string;
  drinking_frequency: string;
  favorite_beer_type: string;
  beer_occasions: string;
  beer_importance_factors: string[];
}

export interface SnacksSurveyData {
  snack_frequency: string;
  preferred_snack_types: string[];
  snack_occasions: string;
  health_consciousness: string;
  flavor_preferences: string[];
}

export interface ResearchSurvey {
  id?: string;
  user_id: string;
  survey_type: 'beer' | 'snacks';
  survey_data: BeerSurveyData | SnacksSurveyData;
  created_at?: string;
  updated_at?: string;
}

// Custom Surveys Types
export interface CustomSurvey {
  id?: string;
  title: string;
  description?: string;
  introduction: string;
  created_by: string;
  status: 'draft' | 'published' | 'archived';
  target_audience: 'all' | 'new_users' | 'existing_users';
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  expires_at?: string;
}

export interface SurveyQuestion {
  id?: string;
  survey_id: string;
  question_text: string;
  question_subtitle?: string;
  question_type: 'input' | 'select' | 'radio' | 'textarea' | 'number';
  options?: QuestionOption[];
  is_required: boolean;
  order_index: number;
  created_at?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface SurveyResponse {
  id?: string;
  survey_id: string;
  user_id: string;
  response_data: Record<string, any>;
  completed_at?: string;
}

export interface CustomSurveyWithQuestions extends CustomSurvey {
  questions: SurveyQuestion[];
}

export interface SurveyWithResponses extends CustomSurvey {
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  response_count: number;
}