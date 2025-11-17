import { describe, it, expect, beforeAll } from 'vitest'

import { mount } from '@vue/test-utils'
import UserForm from './UserForm.vue'
import '@etus/design-system/styles.css'
import DesignSystem from '@etus/design-system'

// Mock ResizeObserver globally
beforeAll(() => {
  // Mock do ResizeObserver
  global.ResizeObserver = class {
    observe() {
      // Implementação do método observe
    }
    unobserve() {
      // Implementação do método unobserve
    }
    disconnect() {
      // Implementação do método disconnect
    }
  } as unknown as typeof ResizeObserver
})

describe('UserForm', () => {
  it('renders properly', () => {
    const wrapper = mount(UserForm, {
      props: {
        modelValue: true,
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          profileImage:
            'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg',
          created_at: '2021-01-01',
        },
        allAccounts: [
          {
            id: 1,
            name: 'Plusdin',
            domain: 'plusdin.com',
            created_at: '2021-01-01',
          },
        ],
      },
      global: {
        plugins: [DesignSystem],
        stubs: {
          'b-sidebar': {
            template: '<div class="b-sidebar"><slot></slot></div>',
            props: ['modelValue'],
          },
          'b-input': {
            template:
              '<div class="b-input"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
            props: [
              'modelValue',
              'labelValue',
              'errorMessage',
              'isError',
              'required',
              'size',
              'type',
              'isTextArea',
              'disabled',
            ],
          },
          'b-button': {
            template: '<button class="b-button" @click="$emit(\'click\')"><slot></slot></button>',
            props: ['color', 'disabled', 'loading', 'size', 'type'],
          },
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('b-sidebar')
    // Add more specific assertions based on your component structure
  })
})
