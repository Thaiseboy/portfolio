import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSanity } from '@/composables/useSanity.js'

// Mock the Sanity client
vi.mock('@/sanityClient.js', () => ({
  default: {
    fetch: vi.fn()
  }
}))

describe('useSanity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    const { loading, error } = useSanity()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('sets loading state during fetch', async () => {
    const { loading, fetchData } = useSanity()

    const fetchPromise = fetchData('*[_type == "about"]')
    
    expect(loading.value).toBe(true)
    
    await fetchPromise
    
    expect(loading.value).toBe(false)
  })

  it('handles successful data fetch', async () => {
    const mockData = [{ _id: '1', title: 'Test' }]
    const client = await import('@/sanityClient.js')
    client.default.fetch.mockResolvedValue(mockData)

    const { fetchData } = useSanity()

    const result = await fetchData('*[_type == "about"]')

    expect(result).toEqual(mockData)
  })

  it('handles fetch errors', async () => {
    const mockError = new Error('Network error')
    const client = await import('@/sanityClient.js')
    client.default.fetch.mockRejectedValue(mockError)

    const { error, fetchData } = useSanity()

    try {
      await fetchData('*[_type == "about"]')
    } catch (e) {
      expect(error.value).toBe(mockError)
    }
  })

  it('clears error state', () => {
    const { error, clearError } = useSanity()

    error.value = new Error('Test error')
    clearError()

    expect(error.value).toBe(null)
  })
})