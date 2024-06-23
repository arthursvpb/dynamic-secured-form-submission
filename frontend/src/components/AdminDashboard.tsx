'use client'

import { useState, useEffect } from 'react'
import { Form, formsApi } from '@/lib/api'
import { formatDate, copyToClipboard } from '@/lib/utils'
import FormBuilder from './FormBuilder'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      const formsData = await formsApi.getAll()
      setForms(formsData)
    } catch (error) {
      console.error('Failed to load forms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormCreated = () => {
    setShowFormBuilder(false)
    loadForms()
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await copyToClipboard(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (showFormBuilder) {
    return (
      <FormBuilder
        onCancel={() => setShowFormBuilder(false)}
        onSuccess={handleFormCreated}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-reap-green mr-4">⚡ reap</div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Forms</h2>
            <button
              onClick={() => setShowFormBuilder(true)}
              className="btn-primary"
            >
              Create New Form
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-reap-green"></div>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No forms created yet</div>
            <button
              onClick={() => setShowFormBuilder(true)}
              className="btn-primary"
            >
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.title || 'Untitled Form'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {form.sections.length} section{form.sections.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div>Created: {formatDate(form.createdAt)}</div>
                  <div className="mt-1">
                    Fields: {form.sections.reduce((acc, section) => acc + section.fields.length, 0)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={`/form/${form.token}`}
                        readOnly
                        className="form-input flex-1 text-sm"
                      />
                      <button
                        onClick={() => handleCopyUrl(`${window.location.origin}/form/${form.token}`)}
                        className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        {copiedUrl === `${window.location.origin}/form/${form.token}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 