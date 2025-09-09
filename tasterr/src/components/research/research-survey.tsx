"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

export interface SurveyQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: "input" | "select" | "radio" | "checkbox";
  options?: { value: string; label: string }[];
  required: boolean;
}

interface ResearchSurveyProps {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  schema: z.ZodSchema<any>;
  onSubmit: (data: any) => Promise<void>;
  existingData?: any;
}

export default function ResearchSurvey({
  title,
  description,
  questions,
  schema,
  onSubmit,
  existingData
}: ResearchSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: existingData || {}
  });

  const currentQuestion = questions[currentStep];
  const watchedValues = form.watch();

  const canProceed = () => {
    const currentValue = watchedValues[currentQuestion.id];
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === "checkbox") {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    return currentValue && currentValue.toString().trim() !== "";
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      setIsSubmitting(true);
      try {
        const formData = form.getValues();
        await onSubmit(formData);
        setIsComplete(true);
      } catch (error) {
        console.error("Failed to submit survey:", error);
      } finally {
        setIsSubmitting(false);
      }
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
        <Button
          className="mt-6"
          onClick={() => window.location.href = '/research'}
        >
          Back to Research
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
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
                  {!currentQuestion.required && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Optional)
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">{currentQuestion.subtitle}</p>
              </div>

              <FormField
                control={form.control}
                name={currentQuestion.id}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {(() => {
                        if (currentQuestion.type === "input") {
                          return (
                            <Input
                              placeholder={`Enter your answer`}
                              {...field}
                              className="text-lg p-4 h-12"
                            />
                          );
                        }

                        if (currentQuestion.type === "select") {
                          return (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="text-lg p-4 h-12">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentQuestion.options?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
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
                                  <RadioGroupItem value={option.value} id={option.value} />
                                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          );
                        }

                        if (currentQuestion.type === "checkbox") {
                          return (
                            <div className="space-y-3">
                              {currentQuestion.options?.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                  <Checkbox
                                    id={option.value}
                                    checked={field.value?.includes(option.value) || false}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValues, option.value]);
                                      } else {
                                        field.onChange(currentValues.filter((v: string) => v !== option.value));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
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

            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isSubmitting ? "Submitting..." : currentStep === questions.length - 1 ? "Complete" : "Next"}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}