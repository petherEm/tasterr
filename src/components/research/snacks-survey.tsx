"use client";

import * as z from "zod";
import ResearchSurvey, { SurveyQuestion } from "./research-survey";
import { SnacksSurveyData } from "@/lib/types";

const snacksSurveySchema = z.object({
  snack_frequency: z.string().min(1, "Please select how often you snack"),
  preferred_snack_types: z.array(z.string()).min(1, "Please select at least one snack type"),
  snack_occasions: z.string().min(1, "Please select when you usually snack"),
  health_consciousness: z.string().min(1, "Please select your health consciousness level"),
  flavor_preferences: z.array(z.string()).min(1, "Please select at least one flavor preference"),
});

const snacksQuestions: SurveyQuestion[] = [
  {
    id: "snack_frequency",
    title: "How often do you snack?",
    subtitle: "Tell us about your snacking habits",
    type: "select",
    required: true,
    options: [
      { value: "multiple-daily", label: "Multiple times per day" },
      { value: "daily", label: "Once daily" },
      { value: "few-times-week", label: "A few times a week" },
      { value: "weekly", label: "Weekly" },
      { value: "occasionally", label: "Occasionally" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "preferred_snack_types",
    title: "What types of snacks do you prefer?",
    subtitle: "Select all snack categories you enjoy",
    type: "checkbox",
    required: true,
    options: [
      { value: "chips-crisps", label: "Chips and crisps" },
      { value: "chocolate-candy", label: "Chocolate and candy" },
      { value: "nuts-seeds", label: "Nuts and seeds" },
      { value: "fruits", label: "Fresh or dried fruits" },
      { value: "crackers-biscuits", label: "Crackers and biscuits" },
      { value: "popcorn", label: "Popcorn" },
      { value: "pretzels", label: "Pretzels" },
      { value: "energy-bars", label: "Energy/protein bars" },
      { value: "yogurt-dairy", label: "Yogurt and dairy snacks" },
      { value: "vegetables", label: "Fresh vegetables" },
    ],
  },
  {
    id: "snack_occasions",
    title: "When do you usually snack?",
    subtitle: "Select the most common time you reach for snacks",
    type: "radio",
    required: true,
    options: [
      { value: "between-meals", label: "Between meals when hungry" },
      { value: "work-study", label: "While working or studying" },
      { value: "evening-tv", label: "Evening relaxation/watching TV" },
      { value: "social-gatherings", label: "Social gatherings and parties" },
      { value: "late-night", label: "Late night cravings" },
      { value: "exercise-recovery", label: "Before/after exercise" },
      { value: "stress-comfort", label: "When stressed or emotional" },
      { value: "boredom", label: "When bored" },
    ],
  },
  {
    id: "health_consciousness",
    title: "How health-conscious are you about snacking?",
    subtitle: "Select the option that best describes your approach to snack choices",
    type: "radio",
    required: true,
    options: [
      { value: "very-health-conscious", label: "Very health-conscious - I always check ingredients and nutrition" },
      { value: "somewhat-health-conscious", label: "Somewhat health-conscious - I try to balance healthy and tasty options" },
      { value: "neutral", label: "Neutral - Health is not a primary concern when choosing snacks" },
      { value: "taste-focused", label: "Taste-focused - I prioritize flavor over health benefits" },
      { value: "convenience-focused", label: "Convenience-focused - I choose what's easily available" },
    ],
  },
  {
    id: "flavor_preferences",
    title: "What flavors do you gravitate towards?",
    subtitle: "Select all flavor profiles you enjoy in snacks",
    type: "checkbox",
    required: true,
    options: [
      { value: "salty", label: "Salty and savory" },
      { value: "sweet", label: "Sweet and sugary" },
      { value: "spicy", label: "Spicy and hot" },
      { value: "sour", label: "Sour and tangy" },
      { value: "umami", label: "Umami and rich" },
      { value: "smoky", label: "Smoky and barbecue" },
      { value: "cheese", label: "Cheesy and creamy" },
      { value: "chocolate", label: "Chocolate and cocoa" },
      { value: "fruit", label: "Fruity and citrus" },
      { value: "herb-spice", label: "Herbal and spiced" },
    ],
  },
];

interface SnacksSurveyProps {
  onSubmit: (data: SnacksSurveyData) => Promise<void>;
  existingData?: SnacksSurveyData;
}

export default function SnacksSurvey({ onSubmit, existingData }: SnacksSurveyProps) {
  return (
    <ResearchSurvey
      title="Top Snacks Survey"
      description="Share your snacking preferences and help us understand consumer trends"
      questions={snacksQuestions}
      schema={snacksSurveySchema}
      onSubmit={onSubmit}
      existingData={existingData}
    />
  );
}