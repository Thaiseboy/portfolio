import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should run tests correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    expect('hello' + ' world').toBe('hello world')
  })

  it('should handle arrays', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
    expect(arr).toContain(2)
  })

  it('should handle objects', () => {
    const obj = { name: 'Get', role: 'Developer' }
    expect(obj.name).toBe('Get')
    expect(obj).toHaveProperty('role')
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    expect(result).toBe('success')
  })
})