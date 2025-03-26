import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Menu from '../Menu.vue';
import '@BRIUS/design-system/styles.css';
import DesignSystem from '@BRIUS/design-system';

describe('Menu', () => {
  it('renders properly', () => {
    const wrapper = mount(Menu, { props: {
        selectedMenu: 'home',
        menuExpanded: false,
        menuItems: [
          {
            label: "Home",
            value: "home",
            icon: "home",
            path: "/home",
          }]
      },
      global: {
        plugins: [DesignSystem], // Adicionando o Design System como plugin
      },
    });
    
    expect(wrapper.text()).toContain('home');
    expect(wrapper.html()).toContain('class="b-menu"');
    expect(wrapper.props().selectedMenu).toBe('home');
  })
})
