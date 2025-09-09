"use client";

import { useState } from "react";
import { UserSurvey } from "@/lib/types";
import SurveyForm from "./initial-info-form";
import SurveyResults from "./survey-results";

interface StarterWrapperProps {
  initialSurvey?: UserSurvey;
}

export default function StarterWrapper({ initialSurvey }: StarterWrapperProps) {
  const [currentSurvey, setCurrentSurvey] = useState<UserSurvey | undefined>(initialSurvey);
  const [showResults, setShowResults] = useState(!!initialSurvey);

  const handleSurveyComplete = (survey: UserSurvey) => {
    setCurrentSurvey(survey);
    setShowResults(true);
  };

  const handleSurveyUpdate = (survey: UserSurvey) => {
    setCurrentSurvey(survey);
  };

  if (showResults && currentSurvey) {
    return (
      <SurveyResults 
        survey={currentSurvey} 
        onUpdate={handleSurveyUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Tasterr!
          </h1>
          <p className="text-lg text-gray-600">
            Help us personalize your experience by sharing a few details about yourself.
          </p>
        </div>
        <SurveyForm onComplete={handleSurveyComplete} />
      </div>
    </div>
  );
}