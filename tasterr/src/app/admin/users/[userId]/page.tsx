import { notFound } from "next/navigation"
import { getUserSurveyDetails } from "@/app/actions/admin"
import { UserDetailsView } from "@/components/admin/user-details-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface UserDetailsPageProps {
  params: { userId: string }
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const result = await getUserSurveyDetails(params.userId)
  
  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading User Details</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    )
  }

  if (!result.data?.userSurvey) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Details
            </h1>
            <p className="text-gray-600">
              User ID: {params.userId}
            </p>
          </div>
        </div>
      </div>

      {/* User Details */}
      <UserDetailsView
        userSurvey={result.data.userSurvey}
        researchSurveys={result.data.researchSurveys}
        userInfo={result.data.userInfo}
      />
    </div>
  )
}