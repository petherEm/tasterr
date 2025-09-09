"use server"

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "@/lib/supabase"
import { createSupabaseAdminClient } from "@/lib/supabase-admin"
import { CustomSurveyWithQuestions, SurveyResponse } from "@/lib/types"
import { redirect } from "next/navigation"

// Get published surveys available to the user
export async function getAvailableSurveys() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  try {
    // Use admin client to fetch published surveys (bypassing RLS for reading published content)
    const adminSupabase = createSupabaseAdminClient()
    
    // Get published surveys that haven't expired
    const { data: surveys, error } = await adminSupabase
      .from('custom_surveys')
      .select(`
        *,
        questions:survey_questions(*)
      `)
      .eq('status', 'published')
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })

    console.log("Survey query result:", { surveys: surveys?.length, error })

    if (error) {
      console.error("Survey fetch error:", error)
      throw error
    }

    // Use regular client for user-specific data (responses)
    const supabase = createSupabaseClient()
    const { data: userResponses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('survey_id')
      .eq('user_id', userId)

    if (responsesError) {
      console.error("User responses fetch error:", responsesError)
      throw responsesError
    }

    const completedSurveyIds = new Set(userResponses?.map(r => r.survey_id) || [])
    const availableSurveys = (surveys || []).filter(survey => 
      !completedSurveyIds.has(survey.id)
    )

    return {
      success: true,
      data: availableSurveys
    }
  } catch (error) {
    console.error("Failed to fetch available surveys:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch surveys"
    }
  }
}

// Get a specific survey with questions
export async function getSurvey(surveyId: string) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  try {
    // Use admin client to fetch the survey (bypassing RLS for reading published content)
    const adminSupabase = createSupabaseAdminClient()
    
    // Get survey with questions
    const { data: survey, error } = await adminSupabase
      .from('custom_surveys')
      .select(`
        *,
        questions:survey_questions(*)
      `)
      .eq('id', surveyId)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error("Survey fetch error:", error)
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: "Survey not found or not available"
        }
      }
      throw error
    }

    // Use regular client to check user's previous responses
    const supabase = createSupabaseClient()
    const { data: existingResponse } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_id', surveyId)
      .eq('user_id', userId)
      .single()

    if (existingResponse) {
      return {
        success: false,
        error: "You have already completed this survey"
      }
    }

    return {
      success: true,
      data: survey
    }
  } catch (error) {
    console.error("Failed to fetch survey:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch survey"
    }
  }
}

// Submit survey response
export async function submitSurveyResponse(surveyId: string, responses: Record<string, any>) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  try {
    // Use admin client to verify survey exists and is published
    const adminSupabase = createSupabaseAdminClient()
    const { data: survey, error: surveyError } = await adminSupabase
      .from('custom_surveys')
      .select('id, status, expires_at')
      .eq('id', surveyId)
      .eq('status', 'published')
      .single()

    if (surveyError) {
      console.error("Survey verification error:", surveyError)
      throw surveyError
    }

    // Use regular client for user-specific operations
    const supabase = createSupabaseClient()

    // Check expiration
    if (survey.expires_at && new Date(survey.expires_at) < new Date()) {
      return {
        success: false,
        error: "This survey has expired"
      }
    }

    // Check if user has already responded
    const { data: existingResponse } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_id', surveyId)
      .eq('user_id', userId)
      .single()

    if (existingResponse) {
      return {
        success: false,
        error: "You have already completed this survey"
      }
    }

    // Submit response
    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: surveyId,
        user_id: userId,
        response_data: responses
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error("Failed to submit survey response:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit response"
    }
  }
}

// Get user's completed surveys
export async function getUserCompletedSurveys() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  try {
    const supabase = createSupabaseClient()

    const { data: responses, error } = await supabase
      .from('survey_responses')
      .select(`
        *,
        survey:custom_surveys(title, description)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: responses || []
    }
  } catch (error) {
    console.error("Failed to fetch completed surveys:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch completed surveys"
    }
  }
}