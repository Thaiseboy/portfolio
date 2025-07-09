import { describe, it, expect, vi } from 'vitest'
import { useContactForm } from '@/composables/useContactForm'

// Mock the form validation composable
vi.mock('@/composables/useFormValidation', () => ({
  useFormValidation: () => ({
    sanitizeInput: vi.fn(input => input.trim()),
    createFormValidation: vi.fn(() => ({
      errors: { name: '', email: '', message: '' },
      isValid: { value: true },
      validateField: vi.fn(),
      validateAllFields: vi.fn(),
      clearErrors: vi.fn()
    }))
  })
}))

describe('useContactForm', () => {
  it('initializes with correct default values', () => {
    const { form, isSubmitting, errors } = useContactForm()

    expect(form.name).toBe('')
    expect(form.email).toBe('')
    expect(form.message).toBe('')
    expect(isSubmitting.value).toBe(false)
    expect(errors.name).toBe('')
    expect(errors.email).toBe('')
    expect(errors.message).toBe('')
  })

  it('resets form correctly', () => {
    const { form, resetForm } = useContactForm()

    form.name = 'Test'
    form.email = 'test@example.com'
    form.message = 'Test message'

    resetForm()

    expect(form.name).toBe('')
    expect(form.email).toBe('')
    expect(form.message).toBe('')
  })

  it('has correct form structure', () => {
    const { form, isSubmitting, errors, isValid, validateField, submitForm, resetForm } = useContactForm()

    expect(typeof form).toBe('object')
    expect(typeof isSubmitting.value).toBe('boolean')
    expect(typeof errors).toBe('object')
    expect(typeof isValid.value).toBe('boolean')
    expect(typeof validateField).toBe('function')
    expect(typeof submitForm).toBe('function')
    expect(typeof resetForm).toBe('function')
  })
})