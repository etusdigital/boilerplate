import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Menu from './Menu.vue'
import '@etus/design-system/styles.css'
import DesignSystem from '@etus/design-system'

describe('Menu', () => {
  it('renders properly', () => {
    const wrapper = mount(Menu, {
      propsData: {
        modelValue: 'home',
      },
      global: {
        plugins: [DesignSystem], // Adicionando o Design System como plugin
      },
    })

    expect(wrapper.text()).toContain('home')
    expect(wrapper.html()).toContain('class="menu"')
    expect(wrapper.vm.modelValue).toBe('home')
  })
})
