"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { SurveyData, UserSurvey } from "@/lib/types";
import { redirect } from "next/navigation";

export async function getUserSurvey(): Promise<{ success: boolean; data?: UserSurvey; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect("/sign-in");
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('user_surveys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching survey:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || undefined };
  } catch (error) {
    console.error('Failed to fetch survey:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch survey' 
    };
  }
}

export async function submitSurvey(surveyData: SurveyData): Promise<{ success: boolean; data?: UserSurvey; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect("/sign-in");
    }

    const supabase = createSupabaseClient();

    const surveyRecord: Omit<UserSurvey, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      age: surveyData.age || null,
      gender: surveyData.gender || null,
      city_size: surveyData.citySize,
      shopping_frequency: surveyData.shoppingFrequency,
      preferred_brand: surveyData.preferredBrand || null,
      profession: surveyData.profession,
    };

    const { data, error } = await supabase
      .from('user_surveys')
      .upsert(surveyRecord, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting survey:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Survey submission failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit survey' 
    };
  }
}