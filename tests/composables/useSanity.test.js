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

  it('has correct composable functions', () => {
    const { loading, error, clearError, fetchPhotos, fetchSkills, fetchProjects, fetchContact } = useSanity()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(typeof clearError).toBe('function')
    expect(typeof fetchPhotos).toBe('function')
    expect(typeof fetchSkills).toBe('function')
    expect(typeof fetchProjects).toBe('function')
    expect(typeof fetchContact).toBe('function')
  })

  it('handles successful photos fetch', async () => {
    const mockData = [{ _id: '1', imageUrl: 'test.jpg' }]
    const client = await import('@/sanityClient.js')
    client.default.fetch.mockResolvedValue(mockData)

    const { fetchPhotos } = useSanity()

    const result = await fetchPhotos()

    expect(result).toEqual(mockData)
  })

  it('handles successful skills fetch', async () => {
    const mockData = [{ _id: '1', name: 'JavaScript', skillLevel: 90 }]
    const client = await import('@/sanityClient.js')
    client.default.fetch.mockResolvedValue(mockData)

    const { fetchSkills } = useSanity()

    const result = await fetchSkills()

    expect(result).toEqual(mockData)
  })

  it('clears error state', () => {
    const { error, clearError } = useSanity()

    error.value = new Error('Test error')
    clearError()

    expect(error.value).toBe(null)
  })
})