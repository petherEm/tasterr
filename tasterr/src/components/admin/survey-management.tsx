"use client"

import { useState } from "react"
import Link from "next/link"
import { CustomSurvey } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateSurveyStatus, deleteCustomSurvey } from "@/app/actions/admin"
import { Eye, Edit, Trash2, Play, Pause, Archive, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SurveyWithCount extends CustomSurvey {
  response_count: number
}

interface SurveyManagementProps {
  surveys: SurveyWithCount[]
}

export function SurveyManagement({ surveys }: SurveyManagementProps) {
  const [surveyList, setSurveyList] = useState(surveys)
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusUpdate = async (surveyId: string, newStatus: 'draft' | 'published' | 'archived') => {
    setLoading(surveyId)
    try {
      const result = await updateSurveyStatus(surveyId, newStatus)
      if (result.success) {
        setSurveyList(prev => 
          prev.map(survey => 
            survey.id === surveyId 
              ? { ...survey, status: newStatus, published_at: result.data.published_at }
              : survey
          )
        )
      }
    } catch (error) {
      console.error("Failed to update survey:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (surveyId: string) => {
    if (!confirm("Are you sure you want to delete this survey? This action cannot be undone.")) {
      return
    }
    
    setLoading(surveyId)
    try {
      const result = await deleteCustomSurvey(surveyId)
      if (result.success) {
        setSurveyList(prev => prev.filter(survey => survey.id !== surveyId))
      }
    } catch (error) {
      console.error("Failed to delete survey:", error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Play className="h-3 w-3" />
      case 'draft':
        return <Edit className="h-3 w-3" />
      case 'archived':
        return <Archive className="h-3 w-3" />
      default:
        return null
    }
  }

  if (surveyList.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first custom survey</p>
            <Button asChild>
              <Link href="/admin/surveys/create">Create Survey</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {surveyList.map((survey) => (
        <Card key={survey.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-xl">{survey.title}</CardTitle>
                  <Badge 
                    className={`${getStatusColor(survey.status)} flex items-center space-x-1`}
                  >
                    {getStatusIcon(survey.status)}
                    <span className="capitalize">{survey.status}</span>
                  </Badge>
                </div>
                
                {survey.description && (
                  <p className="text-gray-600 mb-2">{survey.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{survey.response_count} responses</span>
                  </div>
                  <span>•</span>
                  <span>
                    Target: {survey.target_audience.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>
                    Created {formatDistanceToNow(new Date(survey.created_at!), { addSuffix: true })}
                  </span>
                  {survey.published_at && (
                    <>
                      <span>•</span>
                      <span>
                        Published {formatDistanceToNow(new Date(survey.published_at), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {survey.introduction.length > 100 
                  ? `${survey.introduction.substring(0, 100)}...` 
                  : survey.introduction
                }
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Responses */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={survey.response_count === 0}
                >
                  <Link href={`/admin/surveys/${survey.id}/responses`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Responses
                  </Link>
                </Button>
                
                {/* Status Actions */}
                {survey.status === 'draft' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusUpdate(survey.id!, 'published')}
                    disabled={loading === survey.id}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                )}
                
                {survey.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(survey.id!, 'archived')}
                    disabled={loading === survey.id}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                )}
                
                {survey.status === 'archived' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(survey.id!, 'published')}
                    disabled={loading === survey.id}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Reactivate
                  </Button>
                )}
                
                {/* Delete */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(survey.id!)}
                  disabled={loading === survey.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}