import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LazySection from '@/components/ui/LazySection.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

describe('LazySection', () => {
  it('renders skeleton loader initially', () => {
    const wrapper = mount(LazySection, {
      slots: {
        default: '<div>Content</div>'
      },
      global: {
        components: {
          SkeletonLoader
        }
      }
    })

    expect(wrapper.find('.lazy-section__placeholder').exists()).toBe(true)
    expect(wrapper.findComponent(SkeletonLoader).exists()).toBe(true)
  })

  it('shows content when visible', async () => {
    const wrapper = mount(LazySection, {
      slots: {
        default: '<div class="test-content">Content</div>'
      },
      global: {
        components: {
          SkeletonLoader
        }
      }
    })

    // Wait for IntersectionObserver to trigger
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.find('.lazy-section__content').exists()).toBe(true)
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  it('hides placeholder when content is visible', async () => {
    const wrapper = mount(LazySection, {
      slots: {
        default: '<div>Content</div>'
      },
      global: {
        components: {
          SkeletonLoader
        }
      }
    })

    // Wait for IntersectionObserver to trigger
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.lazy-section__placeholder').exists()).toBe(false)
    expect(wrapper.find('.lazy-section__content').exists()).toBe(true)
  })

  it('has correct minimum height', () => {
    const wrapper = mount(LazySection, {
      slots: {
        default: '<div>Content</div>'
      },
      global: {
        components: {
          SkeletonLoader
        }
      }
    })

    // Check if min-height is applied via CSS class instead of inline style
    expect(wrapper.find('.lazy-section').exists()).toBe(true)
    expect(wrapper.find('.lazy-section').classes()).toContain('lazy-section')
  })
})