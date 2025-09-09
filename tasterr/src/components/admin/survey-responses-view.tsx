"use client"

import { useState } from "react"
import { SurveyWithResponses } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, Calendar, BarChart3, Download, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SurveyResponsesViewProps {
  survey: SurveyWithResponses
}

export function SurveyResponsesView({ survey }: SurveyResponsesViewProps) {
  const [viewMode, setViewMode] = useState<'individual' | 'summary'>('individual')

  if (survey.response_count === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-500">
              Responses will appear here once users start completing the survey
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Survey Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-2">{survey.title}</CardTitle>
              {survey.description && (
                <p className="text-gray-600 mb-3">{survey.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{survey.response_count} responses</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {formatDistanceToNow(new Date(survey.created_at!), { addSuffix: true })}
                  </span>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="capitalize">
                  {survey.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'individual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('individual')}
                  className="rounded-r-none border-r-0"
                >
                  Individual
                </Button>
                <Button
                  variant={viewMode === 'summary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('summary')}
                  className="rounded-l-none"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Summary
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">{survey.introduction}</p>
          </div>
        </CardContent>
      </Card>

      {/* Responses View */}
      {viewMode === 'individual' ? (
        <IndividualResponsesView survey={survey} />
      ) : (
        <SummaryResponsesView survey={survey} />
      )}
    </div>
  )
}

function IndividualResponsesView({ survey }: { survey: SurveyWithResponses }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Individual Responses</h3>
      
      {survey.responses.map((response, responseIndex) => (
        <Card key={response.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Response #{responseIndex + 1}</Badge>
                <span className="text-sm text-gray-600">
                  User {response.user_id.slice(-8)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(response.completed_at!), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="space-y-4">
              {survey.questions.map((question, questionIndex) => {
                const questionKey = `question_${question.id}`
                const answer = response.response_data[questionKey]
                
                return (
                  <div key={question.id}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        Q{questionIndex + 1}: {question.question_text}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className="text-xs capitalize"
                      >
                        {question.question_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {question.question_subtitle && (
                      <p className="text-sm text-gray-600 mb-2">{question.question_subtitle}</p>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {answer ? (
                        <p className="text-gray-900">
                          {question.question_type === 'radio' || question.question_type === 'select' ? (
                            // Show the label for select/radio questions
                            question.options?.find(opt => opt.value === answer)?.label || answer
                          ) : (
                            answer
                          )}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">No answer provided</p>
                      )}
                    </div>
                    
                    {questionIndex < survey.questions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SummaryResponsesView({ survey }: { survey: SurveyWithResponses }) {
  const generateSummary = (question: any) => {
    const questionKey = `question_${question.id}`
    const answers = survey.responses
      .map(r => r.response_data[questionKey])
      .filter(answer => answer && answer.trim() !== '')

    if (question.question_type === 'radio' || question.question_type === 'select') {
      // Count occurrences of each option
      const counts = answers.reduce((acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(counts).map(([value, count]) => ({
        label: question.options?.find((opt: any) => opt.value === value)?.label || value,
        count,
        percentage: Math.round((count / answers.length) * 100)
      })).sort((a, b) => b.count - a.count)
    } else {
      // For text/number questions, just show sample answers
      return answers.slice(0, 10).map(answer => ({ text: answer }))
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Response Summary</h3>
      
      {survey.questions.map((question, questionIndex) => {
        const summary = generateSummary(question)
        
        return (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Q{questionIndex + 1}: {question.question_text}
                  </CardTitle>
                  {question.question_subtitle && (
                    <p className="text-gray-600 mt-1">{question.question_subtitle}</p>
                  )}
                </div>
                <Badge variant="outline" className="capitalize">
                  {question.question_type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {question.question_type === 'radio' || question.question_type === 'select' ? (
                <div className="space-y-3">
                  {(summary as any[]).map((item: any, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm font-semibold">{item.count}</span>
                        <span className="text-sm text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Sample responses:</p>
                  {(summary as any[]).map((item: any, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900">{item.text}</p>
                    </div>
                  ))}
                  {survey.responses.length > 10 && (
                    <p className="text-sm text-gray-500 italic">
                      ...and {survey.responses.length - 10} more responses
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}