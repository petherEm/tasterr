import { Suspense } from "react"
import { getCustomSurveys } from "@/app/actions/admin"
import { SurveyManagement } from "@/components/admin/survey-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function SurveysPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and monitor custom surveys
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/surveys/create" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Survey</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<SurveyManagementSkeleton />}>
        <SurveyManagementSection />
      </Suspense>
    </div>
  )
}

async function SurveyManagementSection() {
  const result = await getCustomSurveys()
  
  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">
            Failed to load surveys: {result.error}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return <SurveyManagement surveys={result.data || []} />
}

function SurveyManagementSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}