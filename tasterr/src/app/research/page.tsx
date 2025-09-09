import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSurvey } from "@/app/actions/survey";
import { getAvailableSurveys } from "@/app/actions/surveys";
import ResearchHub from "@/components/research/research-hub";

export default async function ResearchPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's profile survey
  const surveyResult = await getUserSurvey();
  
  if (!surveyResult.success || !surveyResult.data) {
    redirect("/starter");
  }

  // Get available custom surveys
  const customSurveysResult = await getAvailableSurveys();
  const customSurveys = customSurveysResult.success ? customSurveysResult.data : [];

  return (
    <ResearchHub 
      userSurvey={surveyResult.data} 
      customSurveys={customSurveys || []} 
    />
  );
}
