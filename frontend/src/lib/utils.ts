import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'absolute'
  textArea.style.left = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  return new Promise((resolve, reject) => {
    if (document.execCommand('copy')) {
      resolve()
    } else {
      reject(new Error('Failed to copy'))
    }
    document.body.removeChild(textArea)
  })
}

export function validateFormData(sections: any[]): string[] {
  const errors: string[] = []
  
  if (!sections || sections.length === 0) {
    errors.push('At least one section is required')
    return errors
  }
  
  sections.forEach((section, sectionIndex) => {
    if (!section.name?.trim()) {
      errors.push(`Section ${sectionIndex + 1} must have a name`)
    }
    
    if (!section.fields || section.fields.length === 0) {
      errors.push(`Section "${section.name}" must have at least one field`)
    } else {
      section.fields.forEach((field: any, fieldIndex: number) => {
        if (!field.label?.trim()) {
          errors.push(`Field ${fieldIndex + 1} in section "${section.name}" must have a label`)
        }
        if (!field.type || !['text', 'number'].includes(field.type)) {
          errors.push(`Field "${field.label}" must have a valid type (text or number)`)
        }
      })
    }
  })
  
  return errors
} 