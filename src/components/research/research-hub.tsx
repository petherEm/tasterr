"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Beer,
  Cookie,
  Users,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { UserSurvey } from "@/lib/types";

interface ResearchHubProps {
  userSurvey: UserSurvey;
}

export default function ResearchHub({ userSurvey }: ResearchHubProps) {
  const surveys = [
    {
      id: "world-of-beer",
      title: "World of Beer",
      description:
        "Share your beer preferences and drinking habits to help us understand the beer market better.",
      icon: <Beer className="w-8 h-8 text-red-600" />,
      estimatedTime: "3-4 minutes",
      participants: "2,847",
      color: "red",
      href: "/research/world-of-beer",
    },
    {
      id: "top-snacks",
      title: "Top Snacks",
      description:
        "Tell us about your snacking habits and flavor preferences to shape the future of snack foods.",
      icon: <Cookie className="w-8 h-8 text-red-500" />,
      estimatedTime: "3-4 minutes",
      participants: "3,156",
      color: "red",
      href: "/research/top-snacks",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium mb-6 border border-red-200">
            <Users className="w-4 h-4 mr-2" />
            Research Hub
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Voice,{" "}
            <span className="text-transparent bg-gradient-to-r from-red-500 to-red-700 bg-clip-text">
              Shape the Future
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Welcome back,{" "}
            {userSurvey.profession?.toLowerCase().includes("student")
              ? "Student"
              : "Professional"}
            ! Help brands create better products by participating in our market
            research surveys.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Profile Complete
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Quick & Easy
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              Join Thousands
            </div>
          </div>
        </motion.div>

        {/* Survey Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {surveys.map((survey, index) => (
            <motion.div key={survey.id} variants={itemVariants}>
              <Card
                className={`h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-red-200 bg-gradient-to-br from-white to-red-50/30`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {survey.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {survey.participants} participants
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {survey.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {survey.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {survey.estimatedTime}
                    </div>
                  </div>

                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 group-hover:scale-105 transition-all duration-300`}
                  >
                    <Link href={survey.href}>
                      Start Survey
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-red-50 border-gray-200">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Why Your Opinion Matters
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your responses help food and beverage companies understand
                consumer preferences, leading to better products that match what
                people actually want. Every survey completed contributes to real
                market insights.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">5K+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">150+</div>
                  <div className="text-sm text-gray-500">Surveys Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">95%</div>
                  <div className="text-sm text-gray-500">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
