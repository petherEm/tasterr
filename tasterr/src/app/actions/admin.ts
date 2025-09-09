"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { createSupabaseAdminClient } from "@/lib/supabase-admin"
import { UserSurvey, ResearchSurvey, CustomSurvey, SurveyQuestion, CustomSurveyWithQuestions, SurveyResponse, SurveyWithResponses } from "@/lib/types"
import { redirect } from "next/navigation"

// Check if user has admin role
export async function checkAdminAccess() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }
  
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    // Check if user has admin role (you can configure this in Clerk dashboard)
    const isAdmin = user.publicMetadata?.role === 'admin' || 
                   user.privateMetadata?.role === 'admin'
    
    if (!isAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }
    
    return { userId, isAdmin: true }
  } catch (error) {
    console.error("Admin access check failed:", error)
    redirect("/")
  }
}

// Get all surveys with user information
export async function getAllSurveys(page: number = 1, limit: number = 20) {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get user surveys with pagination
    const { data: userSurveys, error: userSurveyError, count } = await supabase
      .from('user_surveys')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    
    if (userSurveyError) {
      throw userSurveyError
    }
    
    // Get research surveys for these users
    const userIds = userSurveys?.map(survey => survey.user_id) || []
    const { data: researchSurveys, error: researchError } = await supabase
      .from('research_surveys')
      .select('*')
      .in('user_id', userIds)
    
    if (researchError) {
      throw researchError
    }
    
    // Combine the data
    const surveysWithResearch = userSurveys?.map(userSurvey => ({
      ...userSurvey,
      research_surveys: researchSurveys?.filter(rs => rs.user_id === userSurvey.user_id) || []
    }))
    
    return {
      success: true,
      data: surveysWithResearch,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  } catch (error) {
    console.error("Failed to fetch surveys:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch surveys"
    }
  }
}

// Get survey statistics
export async function getSurveyStats() {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get total user surveys
    const { count: totalUserSurveys } = await supabase
      .from('user_surveys')
      .select('*', { count: 'exact', head: true })
    
    // Get total research surveys
    const { count: totalResearchSurveys } = await supabase
      .from('research_surveys')
      .select('*', { count: 'exact', head: true })
    
    // Get surveys by type
    const { data: surveysByType } = await supabase
      .from('research_surveys')
      .select('survey_type')
    
    const beerSurveys = surveysByType?.filter(s => s.survey_type === 'beer').length || 0
    const snacksSurveys = surveysByType?.filter(s => s.survey_type === 'snacks').length || 0
    
    // Get recent surveys (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentSurveys } = await supabase
      .from('user_surveys')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())
    
    return {
      success: true,
      data: {
        totalUserSurveys: totalUserSurveys || 0,
        totalResearchSurveys: totalResearchSurveys || 0,
        beerSurveys,
        snacksSurveys,
        recentSurveys: recentSurveys || 0
      }
    }
  } catch (error) {
    console.error("Failed to fetch survey stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats"
    }
  }
}

// Get detailed survey information for a specific user
export async function getUserSurveyDetails(userId: string) {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get user survey
    const { data: userSurvey, error: userError } = await supabase
      .from('user_surveys')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    // Get research surveys
    const { data: researchSurveys, error: researchError } = await supabase
      .from('research_surveys')
      .select('*')
      .eq('user_id', userId)
    
    if (userError && userError.code !== 'PGRST116') {
      throw userError
    }
    
    if (researchError) {
      throw researchError
    }
    
    // Get user info from Clerk
    let userInfo = null
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      userInfo = {
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      }
    } catch (clerkError) {
      console.error("Failed to fetch user info from Clerk:", clerkError)
    }
    
    return {
      success: true,
      data: {
        userSurvey,
        researchSurveys: researchSurveys || [],
        userInfo
      }
    }
  } catch (error) {
    console.error("Failed to fetch user survey details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user details"
    }
  }
}

// ====== CUSTOM SURVEYS MANAGEMENT ======

// Get all custom surveys
export async function getCustomSurveys() {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    const { data: surveys, error } = await supabase
      .from('custom_surveys')
      .select(`
        *,
        questions:survey_questions(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Get response counts for each survey
    const surveysWithCounts = await Promise.all(
      (surveys || []).map(async (survey: any) => {
        const { count } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id)
        
        return {
          ...survey,
          response_count: count || 0
        }
      })
    )
    
    return {
      success: true,
      data: surveysWithCounts
    }
  } catch (error) {
    console.error("Failed to fetch custom surveys:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch surveys"
    }
  }
}

// Create a new custom survey
export async function createCustomSurvey(surveyData: {
  title: string
  description?: string
  introduction: string
  target_audience: 'all' | 'new_users' | 'existing_users'
  questions: Omit<SurveyQuestion, 'id' | 'survey_id' | 'created_at'>[]
}) {
  const { userId } = await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Start transaction by creating survey first
    const { data: survey, error: surveyError } = await supabase
      .from('custom_surveys')
      .insert({
        title: surveyData.title,
        description: surveyData.description,
        introduction: surveyData.introduction,
        created_by: userId,
        target_audience: surveyData.target_audience,
        status: 'draft'
      })
      .select()
      .single()
    
    if (surveyError) throw surveyError
    
    // Insert questions
    if (surveyData.questions.length > 0) {
      const questionsToInsert = surveyData.questions.map((q, index) => ({
        survey_id: survey.id,
        question_text: q.question_text,
        question_subtitle: q.question_subtitle,
        question_type: q.question_type,
        options: q.options ? JSON.stringify(q.options) : null,
        is_required: q.is_required,
        order_index: index + 1
      }))
      
      const { error: questionsError } = await supabase
        .from('survey_questions')
        .insert(questionsToInsert)
      
      if (questionsError) throw questionsError
    }
    
    return {
      success: true,
      data: survey
    }
  } catch (error) {
    console.error("Failed to create survey:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create survey"
    }
  }
}

// Update survey status (publish, archive, etc.)
export async function updateSurveyStatus(surveyId: string, status: 'draft' | 'published' | 'archived') {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    const updateData: any = { status }
    if (status === 'published') {
      updateData.published_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('custom_surveys')
      .update(updateData)
      .eq('id', surveyId)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error("Failed to update survey status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update survey"
    }
  }
}

// Get survey with responses for admin viewing
export async function getSurveyWithResponses(surveyId: string) {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get survey with questions
    const { data: survey, error: surveyError } = await supabase
      .from('custom_surveys')
      .select(`
        *,
        questions:survey_questions(*)
      `)
      .eq('id', surveyId)
      .single()
    
    if (surveyError) throw surveyError
    
    // Get responses
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('completed_at', { ascending: false })
    
    if (responsesError) throw responsesError
    
    return {
      success: true,
      data: {
        ...survey,
        responses: responses || [],
        response_count: responses?.length || 0
      }
    }
  } catch (error) {
    console.error("Failed to fetch survey with responses:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch survey data"
    }
  }
}

// Delete a custom survey
export async function deleteCustomSurvey(surveyId: string) {
  await checkAdminAccess()
  
  try {
    const supabase = createSupabaseAdminClient()
    
    // Delete survey (CASCADE will handle questions and responses)
    const { error } = await supabase
      .from('custom_surveys')
      .delete()
      .eq('id', surveyId)
    
    if (error) throw error
    
    return {
      success: true
    }
  } catch (error) {
    console.error("Failed to delete survey:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete survey"
    }
  }
}