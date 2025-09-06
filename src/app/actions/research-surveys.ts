"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { BeerSurveyData, SnacksSurveyData, ResearchSurvey } from "@/lib/types";
import { redirect } from "next/navigation";

export async function submitResearchSurvey(
  surveyType: 'beer' | 'snacks',
  surveyData: BeerSurveyData | SnacksSurveyData
): Promise<{ success: boolean; data?: ResearchSurvey; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect("/sign-in");
    }

    const supabase = createSupabaseClient();

    const surveyRecord: Omit<ResearchSurvey, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      survey_type: surveyType,
      survey_data: surveyData,
    };

    const { data, error } = await supabase
      .from('research_surveys')
      .upsert(surveyRecord, {
        onConflict: 'user_id,survey_type'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting research survey:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Research survey submission failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit survey' 
    };
  }
}

export async function getResearchSurvey(
  surveyType: 'beer' | 'snacks'
): Promise<{ success: boolean; data?: ResearchSurvey; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect("/sign-in");
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('research_surveys')
      .select('*')
      .eq('user_id', userId)
      .eq('survey_type', surveyType)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching research survey:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || undefined };
  } catch (error) {
    console.error('Failed to fetch research survey:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch survey' 
    };
  }
}