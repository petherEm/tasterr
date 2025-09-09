"use client";

import { SnacksSurveyData, ResearchSurvey } from "@/lib/types";
import { submitResearchSurvey } from "@/app/actions/research-surveys";
import SnacksSurvey from "./snacks-survey";

interface SnacksSurveyWrapperProps {
  existingData?: ResearchSurvey;
}

export default function SnacksSurveyWrapper({ existingData }: SnacksSurveyWrapperProps) {
  const handleSubmit = async (data: SnacksSurveyData) => {
    const result = await submitResearchSurvey('snacks', data);
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit survey');
    }
  };

  const existingSurveyData = existingData?.survey_data as SnacksSurveyData | undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {existingData ? (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Survey Completed! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for completing the Top Snacks survey. Your responses have been recorded.
            </p>
            <button
              onClick={() => window.location.href = '/research'}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Research Hub
            </button>
          </div>
        ) : (
          <SnacksSurvey 
            onSubmit={handleSubmit}
            existingData={existingSurveyData}
          />
        )}
      </div>
    </div>
  );
}