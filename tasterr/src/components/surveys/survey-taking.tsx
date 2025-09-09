"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { CustomSurveyWithQuestions } from "@/lib/types"
import { submitSurveyResponse } from "@/app/actions/surveys"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"

interface SurveyTakingProps {
  survey: CustomSurveyWithQuestions
}

export function SurveyTaking({ survey }: SurveyTakingProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: survey.questions.reduce((acc, question, index) => {
      acc[`question_${index}`] = ""
      return acc
    }, {} as Record<string, string>)
  })

  const currentQuestion = survey.questions[currentStep]
  const watchedValues = form.watch()

  const canProceed = () => {
    const currentValue = watchedValues[`question_${currentStep}`]
    return !currentQuestion.is_required || (currentValue && currentValue.trim() !== "")
  }

  const handleNext = async () => {
    if (currentStep < survey.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      setIsSubmitting(true)
      try {
        const formData = form.getValues()
        
        // Transform form data to match question structure
        const responses = survey.questions.reduce((acc, question, index) => {
          const questionKey = `question_${question.id}`
          const formKey = `question_${index}`
          acc[questionKey] = formData[formKey]
          return acc
        }, {} as Record<string, any>)

        const result = await submitSurveyResponse(survey.id!, responses)

        if (result.success) {
          setIsComplete(true)
        } else {
          console.error("Failed to submit survey:", result.error)
          // TODO: Show error toast/message to user
        }
      } catch (error) {
        console.error("Failed to submit survey:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSkip = () => {
    if (!currentQuestion.is_required) {
      form.setValue(`question_${currentStep}`, "")
      handleNext()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

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
        <p className="text-gray-600 mb-6">
          Your responses have been recorded successfully.
        </p>
        <Button onClick={() => router.push("/surveys")}>
          View More Surveys
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Survey Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{survey.title}</CardTitle>
          {survey.description && (
            <p className="text-gray-600">{survey.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">{survey.introduction}</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Question {currentStep + 1} of {survey.questions.length}
          </span>
          <span>
            {Math.round(((currentStep + 1) / survey.questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / survey.questions.length) * 100}%`,
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
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {currentQuestion.question_text}
                      {currentQuestion.is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h2>
                    {currentQuestion.question_subtitle && (
                      <p className="text-gray-600">{currentQuestion.question_subtitle}</p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`question_${currentStep}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {(() => {
                            switch (currentQuestion.question_type) {
                              case "input":
                                return (
                                  <Input
                                    placeholder="Enter your answer"
                                    {...field}
                                    className="text-lg p-4 h-12"
                                  />
                                )
                              
                              case "textarea":
                                return (
                                  <Textarea
                                    placeholder="Enter your detailed answer"
                                    {...field}
                                    rows={4}
                                    className="text-lg p-4"
                                  />
                                )
                              
                              case "number":
                                return (
                                  <Input
                                    type="number"
                                    placeholder="Enter a number"
                                    {...field}
                                    className="text-lg p-4 h-12"
                                  />
                                )

                              case "select":
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
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )

                              case "radio":
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
                                )

                              default:
                                return (
                                  <Input
                                    placeholder="Enter your answer"
                                    {...field}
                                    className="text-lg p-4 h-12"
                                  />
                                )
                            }
                          })()}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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

            <div className="flex gap-3">
              {!currentQuestion.is_required && (
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
                  ? "Submitting..."
                  : currentStep === survey.questions.length - 1
                  ? "Complete Survey"
                  : "Next"}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}