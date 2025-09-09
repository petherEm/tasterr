import { Suspense } from "react"
import { getSurveyStats, getAllSurveys } from "@/app/actions/admin"
import { StatsCards } from "@/components/admin/stats-cards"
import { RecentSurveys } from "@/components/admin/recent-surveys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor survey completions and user engagement
        </p>
      </div>

      {/* Statistics Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCardsSection />
      </Suspense>

      {/* Recent Surveys */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Survey Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RecentSurveysSkeleton />}>
              <RecentSurveysSection />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function StatsCardsSection() {
  const statsResult = await getSurveyStats()
  
  if (!statsResult.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load statistics: {statsResult.error}</p>
      </div>
    )
  }
  
  return <StatsCards stats={statsResult.data} />
}

async function RecentSurveysSection() {
  const surveysResult = await getAllSurveys(1, 10)
  
  if (!surveysResult.success) {
    return (
      <div className="text-red-600">
        Failed to load recent surveys: {surveysResult.error}
      </div>
    )
  }
  
  return <RecentSurveys surveys={surveysResult.data || []} />
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentSurveysSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}