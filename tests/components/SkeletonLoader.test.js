import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

describe('SkeletonLoader', () => {
  it('renders with default props', () => {
    const wrapper = mount(SkeletonLoader)

    expect(wrapper.find('.skeleton-loader').exists()).toBe(true)
    expect(wrapper.find('.skeleton-loader--card').exists()).toBe(true)
  })

  it('renders different types correctly', () => {
    const types = ['card', 'list', 'text', 'box']
    
    types.forEach(type => {
      const wrapper = mount(SkeletonLoader, {
        props: { type }
      })

      expect(wrapper.find(`.skeleton-loader--${type}`).exists()).toBe(true)
    })
  })

  it('applies custom width and height', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        width: '300px',
        height: '200px'
      }
    })

    const element = wrapper.find('.skeleton-loader').element
    expect(element.style.width).toBe('300px')
    expect(element.style.height).toBe('200px')
  })

  it('validates type prop', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'invalid'
      }
    })

    // Should fallback to default type
    expect(wrapper.find('.skeleton-loader--card').exists()).toBe(true)
  })

  it('has animated skeleton effect', () => {
    const wrapper = mount(SkeletonLoader)

    expect(wrapper.find('.skeleton-loader').classes()).toContain('skeleton-loader')
    // Check if skeleton animation CSS is applied
    expect(wrapper.find('.skeleton-loader').element.style.animation).toBeTruthy()
  })
})