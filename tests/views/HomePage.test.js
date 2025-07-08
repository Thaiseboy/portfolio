import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'

describe('HomePage', () => {
  it('renders correctly', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.home-hero').exists()).toBe(true)
  })

  it('displays correct title', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.find('.home-hero__title').text()).toContain('Nice to meet you!')
  })

  it('displays correct subtitle', () => {
    const wrapper = mount(HomePage)

    const subtitle = wrapper.find('.home-hero__subtitle').text()
    expect(subtitle).toContain('Hi, My name is Master Supakon Karanyawad')
  })

  it('displays developer nickname', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.text()).toContain('but you can call me')
    expect(wrapper.text()).toContain('Get')
  })

  it('displays location and role', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.text()).toContain('Netherlands')
    expect(wrapper.text()).toContain('front-end developer')
  })

  it('has profile image', () => {
    const wrapper = mount(HomePage)

    const image = wrapper.find('.home-hero__image')
    expect(image.exists()).toBe(true)
    expect(image.attributes('alt')).toBe('Master Supakon')
  })

  it('has social links', () => {
    const wrapper = mount(HomePage)

    const socialSection = wrapper.find('.home-hero__social')
    expect(socialSection.exists()).toBe(true)
    
    const links = socialSection.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('renders with correct CSS classes', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.find('.home-hero__title').classes()).toContain('header-font')
    expect(wrapper.find('.home-hero__subtitle').classes()).toContain('text-gold')
  })
})