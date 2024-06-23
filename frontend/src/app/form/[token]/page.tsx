'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Form, formsApi, submissionsApi, SubmissionValue } from '@/lib/api'
import FormRenderer from '@/components/FormRenderer'

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (token) {
      loadForm()
    }
  }, [token])

  const loadForm = async () => {
    try {
      const formData = await formsApi.getByToken(token)
      setForm(formData)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Form not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: SubmissionValue[]) => {
    try {
      await submissionsApi.submit(token, values)
      setIsSubmitted(true)
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to submit form')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reap-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="text-4xl font-bold text-reap-green">⚡ reap</div>
              </div>
              
              <div className="text-green-500 text-6xl mb-6">✅</div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank you for your submission!
              </h1>
              
              <div className="text-gray-600 text-lg mb-8">
                <p>Your information has been successfully submitted.</p>
                <p className="mt-2">
                  We have received your details and will process them accordingly.
                </p>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-500">
                  You can safely close this window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-3xl font-bold text-reap-green">⚡ reap</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {form.title || 'Secure Form Submission'}
            </h1>
            <p className="text-gray-600">
              Please use this secure form to provide your information and
              documents to upload to the Resident Profile.
            </p>
          </div>

          <FormRenderer form={form} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
} 