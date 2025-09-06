import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSurvey } from "@/app/actions/survey";
import { getResearchSurvey } from "@/app/actions/research-surveys";
import SnacksSurveyWrapper from "@/components/research/snacks-survey-wrapper";

export default async function TopSnacksPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has completed their starter profile
  const surveyResult = await getUserSurvey();
  
  if (!surveyResult.success || !surveyResult.data) {
    redirect("/starter");
  }

  // Check if user has already completed this research survey
  const existingResearch = await getResearchSurvey('snacks');

  return (
    <SnacksSurveyWrapper 
      existingData={existingResearch.success ? existingResearch.data : undefined}
    />
  );
}
