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