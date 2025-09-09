"use client";

import * as z from "zod";
import ResearchSurvey, { SurveyQuestion } from "./research-survey";
import { BeerSurveyData } from "@/lib/types";

const beerSurveySchema = z.object({
  beer_preference: z.string().min(1, "Please select your beer preference"),
  drinking_frequency: z.string().min(1, "Please select how often you drink beer"),
  favorite_beer_type: z.string().min(1, "Please select your favorite beer type"),
  beer_occasions: z.string().min(1, "Please select when you usually drink beer"),
  beer_importance_factors: z.array(z.string()).min(1, "Please select at least one factor"),
});

const beerQuestions: SurveyQuestion[] = [
  {
    id: "beer_preference",
    title: "How do you feel about beer?",
    subtitle: "Tell us your overall relationship with beer",
    type: "radio",
    required: true,
    options: [
      { value: "love-it", label: "I love beer and drink it regularly" },
      { value: "like-it", label: "I like beer and drink occasionally" },
      { value: "neutral", label: "I'm neutral about beer" },
      { value: "rarely-drink", label: "I rarely drink beer" },
      { value: "dont-drink", label: "I don't drink beer" },
    ],
  },
  {
    id: "drinking_frequency",
    title: "How often do you drink beer?",
    subtitle: "Select the frequency that best describes your beer consumption",
    type: "select",
    required: true,
    options: [
      { value: "daily", label: "Daily" },
      { value: "few-times-week", label: "A few times a week" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "occasionally", label: "Occasionally (special events)" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "favorite_beer_type",
    title: "What's your favorite type of beer?",
    subtitle: "Choose the beer style you enjoy most",
    type: "radio",
    required: true,
    options: [
      { value: "lager", label: "Lager (light, crisp, refreshing)" },
      { value: "ale", label: "Ale (hoppy, bitter, complex)" },
      { value: "wheat", label: "Wheat beer (smooth, cloudy)" },
      { value: "stout-porter", label: "Stout/Porter (dark, rich, creamy)" },
      { value: "ipa", label: "IPA (hoppy, strong, aromatic)" },
      { value: "pilsner", label: "Pilsner (golden, clean, balanced)" },
      { value: "craft-variety", label: "I like trying different craft varieties" },
      { value: "no-preference", label: "No specific preference" },
    ],
  },
  {
    id: "beer_occasions",
    title: "When do you usually drink beer?",
    subtitle: "Select the occasions when you most often enjoy beer",
    type: "radio",
    required: true,
    options: [
      { value: "social-gatherings", label: "Social gatherings and parties" },
      { value: "after-work", label: "After work to unwind" },
      { value: "weekends", label: "Weekend relaxation" },
      { value: "meals", label: "With meals" },
      { value: "celebrations", label: "Special celebrations" },
      { value: "sports-events", label: "While watching sports" },
      { value: "casual-daily", label: "Casual daily consumption" },
      { value: "rarely-special", label: "Rarely, only on special occasions" },
    ],
  },
  {
    id: "beer_importance_factors",
    title: "What factors are important when choosing beer?",
    subtitle: "Select all factors that influence your beer choice",
    type: "checkbox",
    required: true,
    options: [
      { value: "taste", label: "Taste and flavor" },
      { value: "price", label: "Price and value" },
      { value: "brand", label: "Brand reputation" },
      { value: "alcohol-content", label: "Alcohol content" },
      { value: "local-craft", label: "Local or craft brewery" },
      { value: "packaging", label: "Packaging and design" },
      { value: "recommendations", label: "Friend/expert recommendations" },
      { value: "health-conscious", label: "Health considerations (low calories, organic)" },
      { value: "availability", label: "Availability in stores/bars" },
      { value: "novelty", label: "Trying new and unique varieties" },
    ],
  },
];

interface BeerSurveyProps {
  onSubmit: (data: BeerSurveyData) => Promise<void>;
  existingData?: BeerSurveyData;
}

export default function BeerSurvey({ onSubmit, existingData }: BeerSurveyProps) {
  return (
    <ResearchSurvey
      title="World of Beer Survey"
      description="Help us understand your beer preferences and drinking habits"
      questions={beerQuestions}
      schema={beerSurveySchema}
      onSubmit={onSubmit}
      existingData={existingData}
    />
  );
}