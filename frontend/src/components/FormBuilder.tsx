'use client'

import { useState } from 'react'
import { CreateFormData, formsApi } from '@/lib/api'
import { validateFormData } from '@/lib/utils'

interface FormBuilderProps {
  onCancel: () => void
  onSuccess: () => void
}

interface FormField {
  label: string
  type: 'text' | 'number'
}

interface FormSection {
  name: string
  fields: FormField[]
}

export default function FormBuilder({ onCancel, onSuccess }: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState('')
  const [sections, setSections] = useState<FormSection[]>([
    { name: '', fields: [{ label: '', type: 'text' }] }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const addSection = () => {
    setSections([...sections, { name: '', fields: [{ label: '', type: 'text' }] }])
  }

  const removeSection = (sectionIndex: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, index) => index !== sectionIndex))
    }
  }

  const updateSection = (sectionIndex: number, name: string) => {
    const newSections = [...sections]
    newSections[sectionIndex].name = name
    setSections(newSections)
  }

  const addField = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].fields.push({ label: '', type: 'text' })
    setSections(newSections)
  }

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...sections]
    if (newSections[sectionIndex].fields.length > 1) {
      newSections[sectionIndex].fields = newSections[sectionIndex].fields.filter((_, index) => index !== fieldIndex)
      setSections(newSections)
    }
  }

  const updateField = (sectionIndex: number, fieldIndex: number, field: Partial<FormField>) => {
    const newSections = [...sections]
    newSections[sectionIndex].fields[fieldIndex] = {
      ...newSections[sectionIndex].fields[fieldIndex],
      ...field
    }
    setSections(newSections)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateFormData(sections)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const formData: CreateFormData = {
        title: formTitle.trim() || undefined,
        sections: sections.map(section => ({
          name: section.name.trim(),
          fields: section.fields.map(field => ({
            label: field.label.trim(),
            type: field.type
          }))
        }))
      }

      await formsApi.create(formData)
      onSuccess()
    } catch (error: any) {
      setErrors([error.response?.data?.error || 'Failed to create form'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
            <button
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.length > 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Form Settings</h2>
            <div>
              <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700">
                Form Title (Optional)
              </label>
              <input
                type="text"
                id="formTitle"
                className="form-input mt-1"
                placeholder="Enter form title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
          </div>

          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Section {sectionIndex + 1}
                </h3>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Section
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section Name
                  </label>
                  <input
                    type="text"
                    className="form-input mt-1"
                    placeholder="e.g., Personal Information"
                    value={section.name}
                    onChange={(e) => updateSection(sectionIndex, e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fields
                    </label>
                    <button
                      type="button"
                      onClick={() => addField(sectionIndex)}
                      className="text-reap-green hover:text-reap-green/80 text-sm"
                    >
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                        <div className="flex-1">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Field label"
                            value={field.label}
                            onChange={(e) => updateField(sectionIndex, fieldIndex, { label: e.target.value })}
                          />
                        </div>
                        <div className="w-32">
                          <select
                            className="form-input"
                            value={field.type}
                            onChange={(e) => updateField(sectionIndex, fieldIndex, { type: e.target.value as 'text' | 'number' })}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                          </select>
                        </div>
                        {section.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(sectionIndex, fieldIndex)}
                            className="text-red-600 hover:text-red-800 text-sm px-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={addSection}
              className="btn-secondary"
            >
              Add Section
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Form...' : 'Create Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 