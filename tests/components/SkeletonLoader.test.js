import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

describe('SkeletonLoader', () => {
  it('renders with default props', () => {
    const wrapper = mount(SkeletonLoader)

    expect(wrapper.find('.skeleton-loader').exists()).toBe(true)
    expect(wrapper.find('.skeleton-box').exists()).toBe(true)
  })

  it('renders different types correctly', () => {
    const types = ['card', 'list', 'text', 'box']
    
    types.forEach(type => {
      const wrapper = mount(SkeletonLoader, {
        props: { type }
      })

      if (type === 'card') {
        expect(wrapper.find('.skeleton-card').exists()).toBe(true)
      } else if (type === 'list') {
        expect(wrapper.find('.skeleton-list').exists()).toBe(true)
      } else if (type === 'text') {
        expect(wrapper.find('.skeleton-text-block').exists()).toBe(true)
      } else if (type === 'box') {
        expect(wrapper.find('.skeleton-box').exists()).toBe(true)
      }
    })
  })

  it('applies custom width and height for box type', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'box',
        width: '300px',
        height: '200px'
      }
    })

    const element = wrapper.find('.skeleton-box').element
    expect(element.style.width).toBe('300px')
    expect(element.style.height).toBe('200px')
  })

  it('renders card type with correct structure', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'card'
      }
    })

    expect(wrapper.find('.skeleton-card').exists()).toBe(true)
    expect(wrapper.find('.skeleton-image').exists()).toBe(true)
    expect(wrapper.find('.skeleton-content').exists()).toBe(true)
    expect(wrapper.find('.skeleton-title').exists()).toBe(true)
  })

  it('renders without errors', () => {
    const wrapper = mount(SkeletonLoader)

    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.find('.skeleton-loader').exists()).toBe(true)
  })
})