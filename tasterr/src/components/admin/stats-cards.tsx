"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, TrendingUp, Calendar } from "lucide-react"

interface StatsData {
  totalUserSurveys: number
  totalResearchSurveys: number
  beerSurveys: number
  snacksSurveys: number
  recentSurveys: number
}

interface StatsCardsProps {
  stats: StatsData
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUserSurveys,
      icon: Users,
      description: "Completed demographic surveys",
      color: "text-blue-600"
    },
    {
      title: "Research Surveys",
      value: stats.totalResearchSurveys,
      icon: FileText,
      description: `${stats.beerSurveys} beer, ${stats.snacksSurveys} snacks`,
      color: "text-green-600"
    },
    {
      title: "This Week",
      value: stats.recentSurveys,
      icon: TrendingUp,
      description: "New surveys completed",
      color: "text-purple-600"
    },
    {
      title: "Completion Rate",
      value: stats.totalResearchSurveys > 0 
        ? `${Math.round((stats.totalResearchSurveys / stats.totalUserSurveys) * 100)}%`
        : "0%",
      icon: Calendar,
      description: "Research survey completion",
      color: "text-orange-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </CardContent>
            {/* Subtle background gradient */}
            <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 opacity-10">
              <Icon className="w-full h-full" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}