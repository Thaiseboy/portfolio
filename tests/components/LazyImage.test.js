import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LazyImage from '@/components/ui/LazyImage.vue'

describe('LazyImage', () => {
  it('renders with correct props', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image',
        width: '300px',
        height: '200px'
      }
    })

    expect(wrapper.find('.lazy-image').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe('Test image')
  })

  it('shows placeholder initially', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    expect(wrapper.find('.lazy-image__placeholder').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('shows image when loaded', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image'
      }
    })

    // Wait for IntersectionObserver to trigger
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test-image.jpg',
        alt: 'Test image',
        className: 'custom-class'
      }
    })

    expect(wrapper.find('.lazy-image').classes()).toContain('custom-class')
  })

  it('handles error state', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'invalid-image.jpg',
        alt: 'Test image'
      }
    })

    // Trigger error
    await wrapper.find('img').trigger('error')

    expect(wrapper.find('.lazy-image__error').exists()).toBe(true)
  })
})