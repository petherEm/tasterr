import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSurvey } from "@/app/actions/survey";
import { getResearchSurvey } from "@/app/actions/research-surveys";
import BeerSurveyWrapper from "@/components/research/beer-survey-wrapper";

export default async function WorldOfBeerPage() {
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
  const existingResearch = await getResearchSurvey('beer');

  return (
    <BeerSurveyWrapper 
      existingData={existingResearch.success ? existingResearch.data : undefined}
    />
  );
}
