import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMainStore } from './index'
import axios from 'axios'

// Mock Auth0
vi.mock('../auth/index', () => ({
  auth0: {
    isAuthenticated: vi.fn(),
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    user: { value: null },
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
  },
}))

// Mock axios
vi.mock('axios')

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Main Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())

    // Reset mocks
    vi.clearAllMocks()
    localStorageMock.clear()

    // Mock import.meta.env
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_AUTH0_ROLES_NAME: 'roles',
          VITE_BACKEND_URL: 'http://localhost:3000',
        },
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with default values', () => {
    const store = useMainStore()
    expect(store.isLoading).toBe(true)
    expect(store.user).toEqual({})
    expect(store.toastOptions).toEqual({
      timeout: 3500,
      type: 'danger',
      top: true,
      right: true,
    })
  })

  it('handles user login correctly', async () => {
    // Mock axios response
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        profileImage: 'https://example.com/image.jpg',
        userAccounts: [
          {
            account: {
              id: '1',
              name: 'Test Account',
            },
          },
        ],
        roles: ['admin'],
      },
    })

    // Setup Auth0 user
    const auth0Module = await import('../auth/index')
    auth0Module.auth0.user.value = {
      email: 'test@example.com',
    }
    auth0Module.auth0.isAuthenticated.value = true

    // Create store and wait for watch to trigger
    const store = useMainStore()

    // Manually trigger the watch function since we can't easily do that in tests
    await vi.importActual('./index')

    // Wait for promises to resolve
    await vi.runAllTimersAsync()

    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/users/login',
      { email: 'test@example.com' },
      {
        headers: {
          'account-id': 1,
          Authorization: 'Bearer mock-token',
        },
      },
    )

    // Verify user data was set correctly
    expect(store.user).toHaveProperty('name', 'Test User')
    expect(store.user).toHaveProperty('email', 'test@example.com')
  })

  it('handles account selection correctly', async () => {
    const store = useMainStore()

    // Setup mock user data
    store.user = {
      userAccounts: [
        {
          account: {
            id: '1',
            name: 'Account 1',
          },
        },
        {
          account: {
            id: '2',
            name: 'Account 2',
          },
        },
      ],
    }

    // Test changing account
    await store.changeAccount('2')

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('selected_account', '2')

    // Verify selectedAccount was updated
    expect(store.selectedAccount).toEqual({
      id: '2',
      name: 'Account 2',
    })
  })

  it('handles logout correctly', async () => {
    const store = useMainStore()

    // Call logout
    await store.logout()

    // Verify Auth0 logout was called
    const auth0Module = await import('../auth/index')
    expect(auth0Module.auth0.logout).toHaveBeenCalled()
  })

  it('handles getAccessTokenSilently correctly', async () => {
    const store = useMainStore()

    // Call getAccessTokenSilently
    const token = await store.getAccessTokenSilently()

    // Verify Auth0 getAccessTokenSilently was called
    const auth0Module = await import('../auth/index')
    expect(auth0Module.auth0.getAccessTokenSilently).toHaveBeenCalled()

    // Verify token was returned
    expect(token).toBe('mock-token')
  })

  it('selects the first account when no account is selected', async () => {
    const store = useMainStore()

    localStorageMock.clear()

    // Setup mock user data
    store.user = {
      userAccounts: [
        {
          account: {
            id: '1',
            name: 'Default Account',
          },
        },
      ],
    }

    store.changeAccount('1')

    // Call getSelectedAccount directly
    const selectedAccount = store.selectedAccount

    // Verify the first account was selected
    expect(selectedAccount).toEqual({
      id: '1',
      name: 'Default Account',
    })
  })

  it('selects a previously selected account from localStorage', async () => {
    // Setup localStorage with a selected account
    localStorageMock.setItem('selected_account', '2')

    const store = useMainStore()

    // Setup mock user data
    store.user = {
      userAccounts: [
        {
          account: {
            id: '1',
            name: 'Account 1',
          },
        },
        {
          account: {
            id: '2',
            name: 'Saved Account',
          },
        },
      ],
    }

    // Call getSelectedAccount directly
    const selectedAccount = store.selectedAccount

    // Verify the saved account was selected
    expect(selectedAccount).toEqual({
      id: '2',
      name: 'Account 2',
    })
  })
})
