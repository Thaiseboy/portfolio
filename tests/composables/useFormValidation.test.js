import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

describe('useFormValidation', () => {
  it('validates name correctly', () => {
    const { validateName } = useFormValidation()

    expect(validateName('')).toBe('Name is required')
    expect(validateName('a')).toBe('Name must be at least 2 characters long')
    expect(validateName('a'.repeat(51))).toBe('Name must be less than 50 characters')
    expect(validateName('123')).toBe('Name can only contain letters, spaces, hyphens, and apostrophes')
    expect(validateName('John Doe')).toBe('')
    expect(validateName("O'Connor")).toBe('')
  })

  it('validates email correctly', () => {
    const { validateEmail } = useFormValidation()

    expect(validateEmail('')).toBe('Email is required')
    expect(validateEmail('invalid')).toBe('Please enter a valid email address')
    expect(validateEmail('test@')).toBe('Please enter a valid email address')
    expect(validateEmail('a'.repeat(250) + '@test.com')).toBe('Email address is too long')
    expect(validateEmail('test@example.com')).toBe('')
  })

  it('validates message correctly', () => {
    const { validateMessage } = useFormValidation()

    expect(validateMessage('')).toBe('Message is required')
    expect(validateMessage('short')).toBe('Message must be at least 10 characters long')
    expect(validateMessage('a'.repeat(1001))).toBe('Message must be less than 1000 characters')
    expect(validateMessage('This is a valid message')).toBe('')
  })

  it('sanitizes input correctly', () => {
    const { sanitizeInput } = useFormValidation()

    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
    expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")')
    expect(sanitizeInput('onclick=alert("xss")')).toBe('alert("xss")')
    expect(sanitizeInput('  normal text  ')).toBe('normal text')
  })

  it('creates form validation state correctly', () => {
    const { createFormValidation } = useFormValidation()
    const formData = reactive({
      name: '',
      email: '',
      message: ''
    })

    const { errors, isValid, validateField } = createFormValidation(formData)

    expect(errors.name).toBe('')
    expect(errors.email).toBe('')
    expect(errors.message).toBe('')
    
    // Fill form with valid data
    formData.name = 'John'
    formData.email = 'john@example.com'
    formData.message = 'This is a test message'

    validateField('name')
    validateField('email')
    validateField('message')

    expect(errors.name).toBe('')
    expect(errors.email).toBe('')
    expect(errors.message).toBe('')
    
    // isValid should be computed and reactive
    expect(typeof isValid.value).toBe('boolean')
    expect(isValid.value).toBe(true)
  })
})