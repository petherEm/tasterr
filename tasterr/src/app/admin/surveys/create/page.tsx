import { SurveyBuilder } from "@/components/admin/survey-builder"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateSurveyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" asChild>
          <Link href="/admin/surveys" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Surveys</span>
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Survey</h1>
          <p className="text-gray-600 mt-1">
            Build a custom survey with questions and publish it for users
          </p>
        </div>
      </div>

      {/* Survey Builder */}
      <SurveyBuilder />
    </div>
  )
}