import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSurvey } from "@/app/actions/survey";
import ResearchHub from "@/components/research/research-hub";

export default async function ResearchPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has completed their starter profile
  const surveyResult = await getUserSurvey();
  
  if (!surveyResult.success || !surveyResult.data) {
    redirect("/starter");
  }

  return <ResearchHub userSurvey={surveyResult.data} />;
}
