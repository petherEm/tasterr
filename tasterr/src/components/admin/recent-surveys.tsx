"use client"

import Link from "next/link"
import { UserSurvey, ResearchSurvey } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Eye, User, MapPin, Briefcase } from "lucide-react"

interface ExtendedUserSurvey extends UserSurvey {
  research_surveys: ResearchSurvey[]
}

interface RecentSurveysProps {
  surveys: ExtendedUserSurvey[]
}

export function RecentSurveys({ surveys }: RecentSurveysProps) {
  if (surveys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No surveys completed yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => (
        <div
          key={survey.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900">
                  User {survey.user_id.slice(-8)}
                </h4>
                <div className="flex space-x-1">
                  {survey.research_surveys.map((rs) => (
                    <Badge
                      key={rs.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {rs.survey_type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{survey.city_size.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{survey.profession}</span>
                </div>
                <span>
                  {survey.created_at
                    ? formatDistanceToNow(new Date(survey.created_at), { addSuffix: true })
                    : 'Recently'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={survey.research_surveys.length > 0 ? "default" : "outline"}
              className="text-xs"
            >
              {survey.research_surveys.length} research
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/admin/users/${survey.user_id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      ))}
      
      {surveys.length >= 10 && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/admin/surveys">
              View All Surveys
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function FileText({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}