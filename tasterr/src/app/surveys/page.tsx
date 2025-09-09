import { redirect } from "next/navigation"

export default function SurveysRedirectPage() {
  // Redirect old surveys page to research hub
  redirect("/research")
}