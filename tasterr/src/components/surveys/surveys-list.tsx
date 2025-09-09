"use client"

import Link from "next/link"
import { CustomSurveyWithQuestions } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SurveysListProps {
  surveys: CustomSurveyWithQuestions[]
}

export function SurveysList({ surveys }: SurveysListProps) {
  if (surveys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys available</h3>
            <p className="text-gray-500">
              Check back later for new surveys to participate in
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {surveys.map((survey) => (
        <Card key={survey.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{survey.title}</CardTitle>
                {survey.description && (
                  <p className="text-gray-600 mb-3">{survey.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <span>•</span>
                  
                  <Badge variant="secondary" className="capitalize">
                    {survey.target_audience.replace('_', ' ')}
                  </Badge>
                  
                  <span>•</span>
                  
                  <span>
                    Added {formatDistanceToNow(new Date(survey.created_at!), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <p className="text-gray-700 mb-4">
                  {survey.introduction.length > 150 
                    ? `${survey.introduction.substring(0, 150)}...` 
                    : survey.introduction
                  }
                </p>
                
                <div className="text-xs text-gray-500">
                  Estimated time: {Math.max(1, Math.ceil(survey.questions.length * 0.5))} minutes
                </div>
              </div>
              
              <Button asChild className="ml-4">
                <Link href={`/surveys/${survey.id}`} className="flex items-center space-x-2">
                  <span>Start Survey</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}