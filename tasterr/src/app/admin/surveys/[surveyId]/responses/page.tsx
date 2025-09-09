import { notFound } from "next/navigation"
import { getSurveyWithResponses } from "@/app/actions/admin"
import { SurveyResponsesView } from "@/components/admin/survey-responses-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SurveyResponsesPageProps {
  params: { surveyId: string }
}

export default async function SurveyResponsesPage({ params }: SurveyResponsesPageProps) {
  const result = await getSurveyWithResponses(params.surveyId)
  
  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Survey Responses</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    )
  }

  if (!result.data) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/surveys" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Surveys</span>
            </Link>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Survey Responses
            </h1>
            <p className="text-gray-600">
              {result.data.title} - {result.data.response_count} responses
            </p>
          </div>
        </div>
      </div>

      {/* Survey Responses */}
      <SurveyResponsesView survey={result.data} />
    </div>
  )
}