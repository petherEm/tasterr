"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createCustomSurvey } from "@/app/actions/admin"
import { SurveyQuestion, QuestionOption } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical, Eye } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const questionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  question_subtitle: z.string().optional(),
  question_type: z.enum(["input", "select", "radio", "textarea", "number"]),
  is_required: z.boolean(),
  options: z.array(z.object({
    value: z.string().min(1, "Option value is required"),
    label: z.string().min(1, "Option label is required")
  })).optional()
})

const surveySchema = z.object({
  title: z.string().min(1, "Survey title is required"),
  description: z.string().optional(),
  introduction: z.string().min(10, "Introduction must be at least 10 characters"),
  target_audience: z.enum(["all", "new_users", "existing_users"]),
  questions: z.array(questionSchema).min(1, "At least one question is required")
})

type SurveyFormData = z.infer<typeof surveySchema>

export function SurveyBuilder() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      introduction: "",
      target_audience: "all",
      questions: [{
        question_text: "",
        question_subtitle: "",
        question_type: "input",
        is_required: true,
        options: []
      }]
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions"
  })

  const watchedQuestions = form.watch("questions")

  const addQuestion = () => {
    append({
      question_text: "",
      question_subtitle: "",
      question_type: "input",
      is_required: true,
      options: []
    })
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex].options || []
    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      { value: "", label: "" }
    ])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex].options || []
    const newOptions = currentOptions.filter((_, index) => index !== optionIndex)
    form.setValue(`questions.${questionIndex}.options`, newOptions)
  }

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true)
    try {
      const result = await createCustomSurvey(data)
      if (result.success) {
        router.push("/admin/surveys")
      } else {
        console.error("Failed to create survey:", result.error)
      }
    } catch (error) {
      console.error("Failed to create survey:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const questionTypeRequiresOptions = (type: string) => {
    return type === "select" || type === "radio"
  }

  if (previewMode) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Survey Preview</h2>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <Eye className="h-4 w-4 mr-2" />
            Exit Preview
          </Button>
        </div>
        <SurveyPreview data={form.getValues()} />
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Survey Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Survey Title *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter survey title"
              className="mt-1"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="Brief description of the survey"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="introduction">Introduction *</Label>
            <Textarea
              id="introduction"
              {...form.register("introduction")}
              placeholder="Welcome message and instructions for survey takers"
              rows={3}
              className="mt-1"
            />
            {form.formState.errors.introduction && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.introduction.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Select
              value={form.watch("target_audience")}
              onValueChange={(value: any) => form.setValue("target_audience", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new_users">New Users Only</SelectItem>
                <SelectItem value="existing_users">Existing Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Survey Questions</CardTitle>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, questionIndex) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Question {questionIndex + 1}</span>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(questionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`questions.${questionIndex}.question_text`}>
                    Question Text *
                  </Label>
                  <Input
                    {...form.register(`questions.${questionIndex}.question_text`)}
                    placeholder="Enter your question"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`questions.${questionIndex}.question_subtitle`}>
                    Subtitle (Optional)
                  </Label>
                  <Input
                    {...form.register(`questions.${questionIndex}.question_subtitle`)}
                    placeholder="Additional context or help text"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={form.watch(`questions.${questionIndex}.question_type`)}
                      onValueChange={(value: any) => {
                        form.setValue(`questions.${questionIndex}.question_type`, value)
                        if (!questionTypeRequiresOptions(value)) {
                          form.setValue(`questions.${questionIndex}.options`, [])
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="input">Text Input</SelectItem>
                        <SelectItem value="textarea">Long Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="radio">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      checked={form.watch(`questions.${questionIndex}.is_required`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`questions.${questionIndex}.is_required`, !!checked)
                      }
                    />
                    <Label>Required</Label>
                  </div>
                </div>

                {/* Options for select/radio questions */}
                {questionTypeRequiresOptions(form.watch(`questions.${questionIndex}.question_type`)) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Answer Options</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(watchedQuestions[questionIndex].options || []).map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Input
                            placeholder="Option value (e.g., 'satisfied')"
                            value={option.value}
                            onChange={(e) => {
                              const newOptions = [...(watchedQuestions[questionIndex].options || [])]
                              newOptions[optionIndex] = { ...newOptions[optionIndex], value: e.target.value }
                              form.setValue(`questions.${questionIndex}.options`, newOptions)
                            }}
                          />
                          <Input
                            placeholder="Option label (e.g., 'Very Satisfied')"
                            value={option.label}
                            onChange={(e) => {
                              const newOptions = [...(watchedQuestions[questionIndex].options || [])]
                              newOptions[optionIndex] = { ...newOptions[optionIndex], label: e.target.value }
                              form.setValue(`questions.${questionIndex}.options`, newOptions)
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreviewMode(true)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Survey
        </Button>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/surveys")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Survey"}
          </Button>
        </div>
      </div>
    </form>
  )
}

// Survey Preview Component
function SurveyPreview({ data }: { data: SurveyFormData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && (
          <p className="text-gray-600">{data.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700">{data.introduction}</p>
        </div>
        
        {data.questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-base font-medium">
              {index + 1}. {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.question_subtitle && (
              <p className="text-sm text-gray-600">{question.question_subtitle}</p>
            )}
            
            {question.question_type === "input" && (
              <Input placeholder="Text input" disabled />
            )}
            {question.question_type === "textarea" && (
              <Textarea placeholder="Long text input" disabled rows={3} />
            )}
            {question.question_type === "number" && (
              <Input type="number" placeholder="Number input" disabled />
            )}
            {question.question_type === "select" && (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {question.options?.map((option, optionIndex) => (
                    <SelectItem key={optionIndex} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {question.question_type === "radio" && (
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <input type="radio" name={`preview-q${index}`} disabled />
                    <Label>{option.label}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}