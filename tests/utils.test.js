import { describe, it, expect } from 'vitest'

describe('Utility Functions', () => {
  it('should format text correctly', () => {
    const formatTitle = (text) => text.charAt(0).toUpperCase() + text.slice(1)
    
    expect(formatTitle('hello')).toBe('Hello')
    expect(formatTitle('world')).toBe('World')
  })

  it('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('user@domain')).toBe(false)
  })

  it('should handle URL validation', () => {
    const isValidUrl = (url) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }
    
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('invalid-url')).toBe(false)
  })

  it('should truncate text', () => {
    const truncate = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
    
    expect(truncate('Hello World', 5)).toBe('Hello...')
    expect(truncate('Hi', 10)).toBe('Hi')
  })

  it('should generate slug from title', () => {
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    expect(generateSlug('Hello World')).toBe('hello-world')
    expect(generateSlug('Vue.js Developer')).toBe('vue-js-developer')
  })
})