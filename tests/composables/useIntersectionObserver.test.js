import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver
})

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    const TestComponent = defineComponent({
      setup() {
        const { isIntersecting, targetRef } = useIntersectionObserver()
        return { isIntersecting, targetRef }
      },
      template: '<div ref="targetRef">{{ isIntersecting }}</div>'
    })

    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.isIntersecting).toBe(false)
    expect(wrapper.vm.targetRef).toBeTruthy()
  })

  it('provides correct API', () => {
    const TestComponent = defineComponent({
      setup() {
        const { isIntersecting, targetRef, startObserving, stopObserving } = useIntersectionObserver()
        return { isIntersecting, targetRef, startObserving, stopObserving }
      },
      template: '<div ref="targetRef">Test</div>'
    })

    const wrapper = mount(TestComponent)
    
    expect(typeof wrapper.vm.isIntersecting).toBe('boolean')
    expect(wrapper.vm.targetRef).toBeTruthy()
    expect(typeof wrapper.vm.startObserving).toBe('function')
    expect(typeof wrapper.vm.stopObserving).toBe('function')
  })

  it('accepts custom options', () => {
    const options = {
      rootMargin: '100px',
      threshold: 0.5
    }

    const TestComponent = defineComponent({
      setup() {
        const { isIntersecting, targetRef } = useIntersectionObserver(options)
        return { isIntersecting, targetRef }
      },
      template: '<div ref="targetRef">Test</div>'
    })

    mount(TestComponent)

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining(options)
    )
  })
})