import { createSupabaseClient } from "@/lib/supabase";
import { SurveyData, UserSurvey } from "@/lib/types";

export class SurveyService {
  private supabase = createSupabaseClient();

  async submitSurvey(userId: string, surveyData: SurveyData): Promise<UserSurvey | null> {
    try {
      const surveyRecord: Omit<UserSurvey, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        age: surveyData.age || null,
        gender: surveyData.gender || null,
        city_size: surveyData.citySize,
        shopping_frequency: surveyData.shoppingFrequency,
        preferred_brand: surveyData.preferredBrand || null,
        profession: surveyData.profession,
      };

      const { data, error } = await this.supabase
        .from('user_surveys')
        .upsert(surveyRecord, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting survey:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Survey submission failed:', error);
      throw error;
    }
  }

  async getSurveyByUserId(userId: string): Promise<UserSurvey | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_surveys')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching survey:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to fetch survey:', error);
      throw error;
    }
  }
}

export const surveyService = new SurveyService();