import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSurvey } from "@/app/actions/survey";
import StarterWrapper from "@/components/main/starter-wrapper";

export default async function StarterPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a survey
  const surveyResult = await getUserSurvey();

  return (
    <StarterWrapper
      initialSurvey={surveyResult.success ? surveyResult.data : undefined}
    />
  );
}
