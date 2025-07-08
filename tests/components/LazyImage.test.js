import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LazyImage from '@/components/ui/LazyImage.vue'

describe('LazyImage', () => {
  it('renders container correctly', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    expect(wrapper.find('.lazy-image-container').exists()).toBe(true)
  })

  it('shows placeholder initially', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    expect(wrapper.find('.image-placeholder').exists()).toBe(true)
  })

  it('shows loading spinner when intersecting', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    // Wait for IntersectionObserver to trigger
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('has correct alt attribute prop', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    // Check if alt prop is correctly passed
    expect(wrapper.props('alt')).toBe('Test image')
  })

  it('renders without errors', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    expect(wrapper.vm).toBeTruthy()
  })
})