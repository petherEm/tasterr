"use client"

import { UserSurvey, ResearchSurvey } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, MapPin, Briefcase, ShoppingBag, Heart, Clock } from "lucide-react"

interface UserInfo {
  email?: string
  firstName?: string
  lastName?: string
  createdAt?: number
}

interface UserDetailsViewProps {
  userSurvey: UserSurvey
  researchSurveys: ResearchSurvey[]
  userInfo: UserInfo | null
}

export function UserDetailsView({
  userSurvey,
  researchSurveys,
  userInfo
}: UserDetailsViewProps) {
  const formatDate = (date: string | number | undefined) => {
    if (!date) return "N/A"
    const dateObj = typeof date === 'number' ? new Date(date) : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCitySize = (citySize: string) => {
    return citySize.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatShoppingFrequency = (freq: string) => {
    const mapping: { [key: string]: string } = {
      'daily': 'Daily',
      'few-times-week': 'A few times a week',
      'weekly': 'Weekly',
      'bi-weekly': 'Every 2 weeks',
      'monthly': 'Monthly',
      'rarely': 'Rarely'
    }
    return mapping[freq] || freq
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userInfo?.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-medium">{userInfo.email}</span>
              </div>
            )}
            
            {(userInfo?.firstName || userInfo?.lastName) && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Name:</span>
                <span className="font-medium">
                  {[userInfo.firstName, userInfo.lastName].filter(Boolean).join(' ')}
                </span>
              </div>
            )}
            
            {userInfo?.createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Account Created:</span>
                <span className="font-medium">{formatDate(userInfo.createdAt)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Survey Completed:</span>
              <span className="font-medium">{formatDate(userSurvey.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographic Survey Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Demographic Survey</span>
            <Badge variant="default">Completed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {userSurvey.age && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Age</label>
                  <p className="text-lg font-medium">{userSurvey.age}</p>
                </div>
              )}
              
              {userSurvey.gender && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-lg font-medium capitalize">
                    {userSurvey.gender.replace('-', ' ')}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium">{formatCitySize(userSurvey.city_size)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Profession</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium">{userSurvey.profession}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Shopping Frequency</label>
                <div className="flex items-center space-x-2 mt-1">
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium">
                    {formatShoppingFrequency(userSurvey.shopping_frequency)}
                  </p>
                </div>
              </div>
              
              {userSurvey.preferred_brand && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Brand</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <p className="text-lg font-medium">{userSurvey.preferred_brand}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Surveys Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Research Surveys</span>
            <Badge variant={researchSurveys.length > 0 ? "default" : "outline"}>
              {researchSurveys.length} Completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {researchSurveys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No research surveys completed yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {researchSurveys.map((survey, index) => (
                <div key={survey.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold capitalize flex items-center space-x-2">
                      <span>{survey.survey_type} Survey</span>
                      <Badge variant="secondary" className="capitalize">
                        {survey.survey_type}
                      </Badge>
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(survey.created_at)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                      {JSON.stringify(survey.survey_data, null, 2)}
                    </pre>
                  </div>
                  
                  {index < researchSurveys.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}