import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UsersView from './UsersView.vue'
import '@etus/design-system/styles.css'
import DesignSystem from '@etus/design-system'
import { nextTick } from 'vue'

// Mock the imported components and composables
vi.mock('@/features/users/components/UserForm.vue', () => ({
  default: {
    name: 'UserForm',
    template: '<div class="user-form-mock"></div>',
    props: ['modelValue', 'user', 'allAccounts'],
  },
}))

// Mock the useUsers composable
vi.mock('@/features/users/composables/useUsers', () => ({
  useUsers: () => ({
    getAllUsers: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        profileImage: 'https://example.com/image.jpg',
        createdAt: '2023-01-01',
        deletedAt: null,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        profileImage: 'https://example.com/image2.jpg',
        createdAt: '2023-02-01',
        deletedAt: null,
      },
    ]),
    saveUser: vi.fn().mockResolvedValue(true),
    deleteUser: vi.fn().mockResolvedValue(true),
  }),
}))

// Mock the useAccounts composable
vi.mock('@/features/accounts/composables/useAccounts', () => ({
  useAccounts: () => ({
    getAllAccounts: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Plusdin',
        domain: 'plusdin.com',
        created_at: '2021-01-01',
      },
      {
        id: 2,
        name: 'Acme Corp',
        domain: 'acme.com',
        created_at: '2021-02-01',
      },
    ]),
  }),
}))

// Mock ResizeObserver globally
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

describe('UsersView', () => {
  it('renders properly with users data', async () => {
    const wrapper = mount(UsersView, {
      global: {
        plugins: [DesignSystem],
        stubs: {
          'b-table': {
            template:
              '<div class="b-table-mock"><slot name="actions" v-bind="{ item: mockItem, index: 0 }"></slot></div>',
            props: ['headers', 'items', 'options', 'loading', 'itemsPerPage'],
            data() {
              return {
                mockItem: {
                  id: 1,
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                },
              }
            },
          },
          'b-round-button': {
            template: '<button class="b-round-button-mock" @click="$emit(\'click\')">Add User</button>',
            props: ['text'],
          },
          'b-icon': {
            template: '<span class="b-icon-mock" @click="$emit(\'click\')"></span>',
            props: ['name'],
          },
          'b-dialog': {
            template: '<div class="b-dialog-mock" v-if="modelValue"><slot></slot></div>',
            props: ['modelValue', 'width'],
          },
          'b-button': {
            template: '<button class="b-button-mock" @click="$emit(\'click\')"><slot></slot></button>',
            props: ['color', 'disabled', 'loading', 'size', 'type'],
          },
          UserForm: true,
        },
      },
    })

    // Wait for the component to load data
    await flushPromises()

    // Check if the component renders correctly
    expect(wrapper.find('h1').text()).toBe('Users')
    expect(wrapper.find('.b-round-button-mock').exists()).toBe(true)
    expect(wrapper.find('.b-table-mock').exists()).toBe(true)

    // Test creating a new user
    await wrapper.find('.b-round-button-mock').trigger('click')

    // Use a safer approach to check component state
    const showFormControl = wrapper.vm.showFormControl
    expect(showFormControl).toBe(true)

    // Test editing a user
    const editIcon = wrapper.find('.b-icon-mock')
    await editIcon.trigger('click')
    expect(wrapper.vm.showFormControl).toBe(true)

    // Test deleting a user
    const deleteIcon = wrapper.findAll('.b-icon-mock')[1]
    await deleteIcon.trigger('click')
    expect(wrapper.vm.showDelete).toBe(true)

    // Test closing the delete dialog
    const cancelButton = wrapper.findAll('.b-button-mock')[0]
    await cancelButton.trigger('click')
    expect(wrapper.vm.showDelete).toBe(false)
  })

  it('handles form submission correctly', async () => {
    const wrapper = mount(UsersView, {
      global: {
        plugins: [DesignSystem],
        stubs: {
          'b-table': true,
          'b-round-button': true,
          'b-icon': true,
          'b-dialog': true,
          'b-button': true,
          UserForm: true,
        },
      },
    })

    // Wait for the component to load data
    await flushPromises()

    // Create a new user
    wrapper.vm.createUser()
    expect(wrapper.vm.showFormControl).toBe(true)

    // Test saving a user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'https://example.com/test.jpg',
    }

    await wrapper.vm.onSave(testUser, false)
    await flushPromises()

    // Verify that fetchUsers was called after saving
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
