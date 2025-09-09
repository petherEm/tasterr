"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { submitSurvey } from "@/app/actions/survey";
import { UserSurvey } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

const surveySchema = z.object({
  age: z.string().optional(),
  gender: z.string().optional(),
  citySize: z.string().min(1, "Please select your city size"),
  shoppingFrequency: z.string().min(1, "Please select how often you shop"),
  preferredBrand: z.string().optional(),
  profession: z.string().min(1, "Please enter your profession"),
});

type SurveyData = z.infer<typeof surveySchema>;

const questions = [
  {
    id: "age",
    title: "How old are you?",
    subtitle: "This helps us understand our audience better",
    optional: true,
    type: "input" as const,
  },
  {
    id: "gender",
    title: "Confirm your gender",
    subtitle: "Optional - only if you're comfortable sharing",
    optional: true,
    type: "select" as const,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "non-binary", label: "Non-binary" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    id: "citySize",
    title: "Where do you live?",
    subtitle: "Tell us about your city size",
    optional: false,
    type: "radio" as const,
    options: [
      { value: "small-town", label: "Small town (under 50k people)" },
      { value: "medium-city", label: "Medium city (50k - 200k people)" },
      { value: "large-city", label: "Large city (200k - 1M people)" },
      { value: "major-metro", label: "Major metropolitan area (1M+ people)" },
    ],
  },
  {
    id: "shoppingFrequency",
    title: "How often do you shop?",
    subtitle: "Include both online and in-store shopping",
    optional: false,
    type: "select" as const,
    options: [
      { value: "daily", label: "Daily" },
      { value: "few-times-week", label: "A few times a week" },
      { value: "weekly", label: "Weekly" },
      { value: "bi-weekly", label: "Every 2 weeks" },
      { value: "monthly", label: "Monthly" },
      { value: "rarely", label: "Rarely" },
    ],
  },
  {
    id: "preferredBrand",
    title: "Do you have a preferred shop brand?",
    subtitle: "Optional - tell us your go-to store",
    optional: true,
    type: "input" as const,
  },
  {
    id: "profession",
    title: "What is your profession?",
    subtitle: "Help us understand your background",
    optional: false,
    type: "input" as const,
  },
];

interface SurveyFormProps {
  existingSurvey?: UserSurvey;
  onComplete?: (survey: UserSurvey) => void;
  onCancel?: () => void;
}

export default function SurveyForm({
  existingSurvey,
  onComplete,
  onCancel,
}: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!existingSurvey;

  const form = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
    defaultValues: existingSurvey
      ? {
          age: existingSurvey.age || "",
          gender: existingSurvey.gender || "",
          citySize: existingSurvey.city_size,
          shoppingFrequency: existingSurvey.shopping_frequency,
          preferredBrand: existingSurvey.preferred_brand || "",
          profession: existingSurvey.profession,
        }
      : {
          age: "",
          gender: "",
          citySize: "",
          shoppingFrequency: "",
          preferredBrand: "",
          profession: "",
        },
  });

  const currentQuestion = questions[currentStep];
  const watchedValues = form.watch();

  const canProceed = () => {
    const currentValue = watchedValues[currentQuestion.id as keyof SurveyData];
    return (
      currentQuestion.optional || (currentValue && currentValue.trim() !== "")
    );
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      setIsSubmitting(true);
      try {
        const formData = form.getValues();
        const result = await submitSurvey(formData);

        if (result.success && result.data) {
          console.log("Survey completed and saved:", formData);
          if (onComplete) {
            onComplete(result.data);
          } else {
            setIsComplete(true);
          }
        } else {
          console.error("Failed to submit survey:", result.error);
          // You might want to show an error toast to the user here
        }
      } catch (error) {
        console.error("Failed to submit survey:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    if (currentQuestion.optional) {
      handleNext();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you! 🎉</h2>
        <p className="text-gray-600">
          Your responses have been recorded successfully.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Question {currentStep + 1} of {questions.length}
          </span>
          <span>
            {Math.round(((currentStep + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentQuestion.title}
                  {currentQuestion.optional && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Optional)
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">{currentQuestion.subtitle}</p>
              </div>

              <FormField
                control={form.control}
                name={currentQuestion.id as keyof SurveyData}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {(() => {
                        if (currentQuestion.type === "input") {
                          return (
                            <Input
                              placeholder={`Enter your ${
                                currentQuestion.id === "age"
                                  ? "age"
                                  : currentQuestion.id === "profession"
                                  ? "profession"
                                  : "preferred brand"
                              }`}
                              {...field}
                              className="text-lg p-4 h-12"
                            />
                          );
                        }

                        if (currentQuestion.type === "select") {
                          return (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="text-lg p-4 h-12">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentQuestion.options?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }

                        if (currentQuestion.type === "radio") {
                          return (
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              {currentQuestion.options?.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                  />
                                  <Label
                                    htmlFor={option.value}
                                    className="flex-1 cursor-pointer"
                                  >
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          );
                        }

                        return null;
                      })()}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {isEditMode && onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="text-gray-500"
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {currentQuestion.optional && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  Skip
                </Button>
              )}

              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : currentStep === questions.length - 1
                  ? isEditMode
                    ? "Update"
                    : "Complete"
                  : "Next"}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
