import { notFound } from "next/navigation"
import { getSurvey } from "@/app/actions/surveys"
import { SurveyTaking } from "@/components/surveys/survey-taking"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SurveyPageProps {
  params: { surveyId: string }
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const result = await getSurvey(params.surveyId)
  
  if (!result.success) {
    if (result.error === "Survey not found or not available" || 
        result.error === "You have already completed this survey") {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Survey Not Available
            </h1>
            <p className="text-gray-600 mb-6">{result.error}</p>
            <Button asChild>
              <Link href="/surveys" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Surveys</span>
              </Link>
            </Button>
          </div>
        </div>
      )
    }
    
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/surveys" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Surveys</span>
          </Link>
        </Button>
      </div>

      <SurveyTaking survey={result.data} />
    </div>
  )
}