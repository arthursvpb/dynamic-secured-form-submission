'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, SubmissionValue } from '@/lib/api'

interface FormRendererProps {
  form: Form
  onSubmit: (values: SubmissionValue[]) => Promise<void>
}

interface FormStepIndicatorProps {
  currentStep: number
  totalSteps: number
  sections: Array<{ name: string }>
}

function FormStepIndicator({ currentStep, totalSteps, sections }: FormStepIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                index < currentStep
                  ? 'bg-reap-green border-reap-green text-white'
                  : index === currentStep
                  ? 'border-reap-green text-reap-green'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            {index < sections.length - 1 && (
              <div
                className={`hidden sm:block w-16 h-0.5 ml-4 ${
                  index < currentStep ? 'bg-reap-green' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">
          {sections[currentStep]?.name}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  )
}

export default function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm()

  const currentSection = form.sections[currentStep]
  const isLastStep = currentStep === form.sections.length - 1

  const validateCurrentStep = async () => {
    const fieldsInCurrentSection = currentSection.fields.map(field => field.id)
    return await trigger(fieldsInCurrentSection)
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < form.sections.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const values: SubmissionValue[] = []
      
      form.sections.forEach(section => {
        section.fields.forEach(field => {
          const value = data[field.id] || ''
          values.push({
            fieldId: field.id,
            value: String(value)
          })
        })
      })

      await onSubmit(values)
    } catch (error: any) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id]

    return (
      <div key={field.id} className="space-y-2">
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
        </label>
        
        {field.type === 'text' ? (
          <input
            id={field.id}
            type="text"
            className={`form-input ${fieldError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register(field.id, {
              required: `${field.label} is required`
            })}
          />
        ) : (
          <input
            id={field.id}
            type="number"
            className={`form-input ${fieldError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register(field.id, {
              required: `${field.label} is required`,
              valueAsNumber: true
            })}
          />
        )}
        
        {fieldError && (
          <p className="text-sm text-red-600">
            {fieldError.message as string}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <FormStepIndicator
        currentStep={currentStep}
        totalSteps={form.sections.length}
        sections={form.sections}
      />

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {submitError && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{submitError}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentSection.name}
          </h2>
          
          <div className="space-y-6">
            {currentSection.fields.map(renderField)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
} 