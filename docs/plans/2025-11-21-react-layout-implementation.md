# React Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replicate Vue application's complete layout, design system, and features in React using shadcn/ui component library.

**Architecture:** Feature-by-feature implementation starting with Layout shell (Navbar + Sidebar), then complete CRUD pages (Users, Accounts, Settings). Uses shadcn/ui components styled with TailwindCSS to match Vue's @etus/design-system appearance. Zustand for state, React Router for navigation, server-side pagination for tables.

**Tech Stack:** React 18, shadcn/ui, TailwindCSS v4, Zustand, React Router v6, React Hook Form, Material Icons

---

## Phase 1: Layout Shell (Navbar + Sidebar + Routing)

### Task 1.1: Initialize shadcn/ui

**Files:**
- Create: `templates/react/components.json`
- Modify: `templates/react/tsconfig.json`
- Modify: `templates/react/tailwind.config.js`

**Step 1: Initialize shadcn/ui**

```bash
cd templates/react
npx shadcn@latest init
```

**Interactive prompts - Choose:**
- TypeScript: Yes
- Style: New York
- Base color: Zinc
- CSS variables: Yes
- Tailwind config: tailwind.config.js
- Components: src/components
- Utils: src/lib/utils
- React Server Components: No
- Write components.json: Yes

**Step 2: Verify initialization**

Check that `components.json` was created:
```bash
cat components.json
```

Expected: File exists with shadcn configuration

**Step 3: Commit**

```bash
git add components.json tsconfig.json tailwind.config.js src/lib/
git commit -m "feat: initialize shadcn/ui component library"
```

---

### Task 1.2: Install Core shadcn Components

**Files:**
- Create: `templates/react/src/components/ui/button.tsx`
- Create: `templates/react/src/components/ui/avatar.tsx`
- Create: `templates/react/src/components/ui/select.tsx`
- Create: `templates/react/src/components/ui/dropdown-menu.tsx`

**Step 1: Install Button component**

```bash
npx shadcn@latest add button
```

**Step 2: Install Avatar component**

```bash
npx shadcn@latest add avatar
```

**Step 3: Install Select component**

```bash
npx shadcn@latest add select
```

**Step 4: Install Dropdown Menu component**

```bash
npx shadcn@latest add dropdown-menu
```

**Step 5: Verify components installed**

```bash
ls src/components/ui/
```

Expected: button.tsx, avatar.tsx, select.tsx, dropdown-menu.tsx exist

**Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shadcn core components (button, avatar, select, dropdown)"
```

---

### Task 1.3: Update Theme Colors to Match Vue

**Files:**
- Modify: `templates/react/src/app/assets/main.css`

**Step 1: Add custom CSS variables for theme**

Update `src/app/assets/main.css`:

```css
@import "tailwindcss";

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Primary color: Teal (#14B8A6) */
  --primary: 172 80% 40%;
  --primary-foreground: 0 0% 100%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 172 80% 40%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 0 0% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 0 0% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 172 80% 40%;
  --primary-foreground: 0 0% 100%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 0 0% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 172 80% 40%;
}

/* Layout constants */
body {
  background-color: #F8F9FA;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-container {
  max-width: 1900px;
  margin: 0 auto;
}
```

**Step 2: Commit**

```bash
git add src/app/assets/main.css
git commit -m "style: update theme colors to match Vue (teal primary)"
```

---

### Task 1.4: Create Layout Component

**Files:**
- Create: `templates/react/src/app/components/Layout.tsx`

**Step 1: Create Layout component file**

Create `src/app/components/Layout.tsx`:

```typescript
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="main-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/components/Layout.tsx
git commit -m "feat: create Layout component with Navbar and Sidebar slots"
```

---

### Task 1.5: Create Navbar Component

**Files:**
- Create: `templates/react/src/app/components/Navbar.tsx`

**Step 1: Create Navbar component**

Create `src/app/components/Navbar.tsx`:

```typescript
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMainStore } from '../stores/mainStore'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth0()
  const { t, i18n } = useTranslation()
  const { selectedAccount, userAccounts, changeAccount } = useMainStore()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleAccountChange = (accountId: string) => {
    changeAccount(accountId)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="/etus-logo.ico" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Boilerplate</span>
        </div>

        {/* Account Selector */}
        <div className="flex-1 max-w-sm">
          <Select value={selectedAccount?.id} onValueChange={handleAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('navbar.selectAccount')} />
            </SelectTrigger>
            <SelectContent>
              {userAccounts?.map((ua) => (
                <SelectItem key={ua.account.id} value={ua.account.id}>
                  {ua.account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Language Selector */}
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name || 'U')}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.name}</span>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t('navbar.logout')}
            >
              <span className="material-icons">logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/components/Navbar.tsx
git commit -m "feat: create Navbar with logo, account selector, language, and user profile"
```

---

### Task 1.6: Create Sidebar Component

**Files:**
- Create: `templates/react/src/app/components/Sidebar.tsx`

**Step 1: Create Sidebar component**

Create `src/app/components/Sidebar.tsx`:

```typescript
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface MenuItem {
  path: string
  label: string
  icon: string
}

export function Sidebar() {
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    { path: '/', label: t('home'), icon: 'home' },
    { path: '/users', label: t('users.title'), icon: 'people' },
    { path: '/accounts', label: t('accounts.title'), icon: 'business' },
    { path: '/settings', label: t('settings.title'), icon: 'settings' },
  ]

  return (
    <aside className="sticky top-16 w-70 h-[calc(100vh-4rem)] border-r bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700'
              )
            }
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/components/Sidebar.tsx
git commit -m "feat: create Sidebar with navigation menu and active state"
```

---

### Task 1.7: Update Router with Layout

**Files:**
- Modify: `templates/react/src/app/router/index.tsx`

**Step 1: Update router to use Layout**

Modify `src/app/router/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import HomePage from '../pages/HomePage'
import CallbackPage from '../pages/CallbackPage'
import NotFoundPage from '../pages/NotFoundPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/callback',
    element: <CallbackPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
```

**Step 2: Commit**

```bash
git add src/app/router/index.tsx
git commit -m "feat: update router to use Layout component for protected routes"
```

---

### Task 1.8: Update Zustand Store

**Files:**
- Modify: `templates/react/src/app/stores/mainStore.ts`

**Step 1: Add account and language state**

Modify `src/app/stores/mainStore.ts`:

```typescript
import { create } from 'zustand'

interface UserAccount {
  account: {
    id: string
    name: string
    domain: string
  }
  role: string
}

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  picture?: string
  isSuperAdmin: boolean
  userAccounts: UserAccount[]
}

interface MainStore {
  user: User | null
  selectedAccount: { id: string; name: string } | null
  userAccounts: UserAccount[]
  currentLanguage: string
  isLoading: boolean

  setUser: (user: User) => void
  setSelectedAccount: (account: { id: string; name: string }) => void
  changeAccount: (accountId: string) => void
  setLanguage: (lang: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useMainStore = create<MainStore>((set, get) => ({
  user: null,
  selectedAccount: null,
  userAccounts: [],
  currentLanguage: 'pt',
  isLoading: true,

  setUser: (user) => {
    const userAccounts = user.userAccounts || []
    const selectedAccount = userAccounts[0]?.account || null
    set({ user, userAccounts, selectedAccount })
  },

  setSelectedAccount: (account) => set({ selectedAccount: account }),

  changeAccount: (accountId) => {
    const { userAccounts } = get()
    const account = userAccounts.find((ua) => ua.account.id === accountId)?.account
    if (account) {
      set({ selectedAccount: account })
      // TODO: Reload data for new account context
    }
  },

  setLanguage: (lang) => set({ currentLanguage: lang }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => set({ user: null, selectedAccount: null, userAccounts: [] }),
}))
```

**Step 2: Commit**

```bash
git add src/app/stores/mainStore.ts
git commit -m "feat: add account and language state to mainStore"
```

---

### Task 1.9: Add i18n Translations for Navbar

**Files:**
- Modify: `templates/react/src/app/i18n/locales/pt.ts`
- Modify: `templates/react/src/app/i18n/locales/en.ts`

**Step 1: Add Portuguese translations**

Add to `src/app/i18n/locales/pt.ts`:

```typescript
export default {
  // ... existing translations

  navbar: {
    logout: 'Sair',
    selectAccount: 'Selecionar conta',
    selectLanguage: 'Selecionar idioma',
  },

  home: 'Início',

  settings: {
    title: 'Configurações',
  },
}
```

**Step 2: Add English translations**

Add to `src/app/i18n/locales/en.ts`:

```typescript
export default {
  // ... existing translations

  navbar: {
    logout: 'Logout',
    selectAccount: 'Select account',
    selectLanguage: 'Select language',
  },

  home: 'Home',

  settings: {
    title: 'Settings',
  },
}
```

**Step 3: Commit**

```bash
git add src/app/i18n/locales/pt.ts src/app/i18n/locales/en.ts
git commit -m "feat: add i18n translations for navbar and navigation"
```

---

### Task 1.10: Test Phase 1 - Layout Shell

**Step 1: Start development server**

```bash
pnpm dev
```

**Step 2: Manual testing checklist**

- [ ] Navigate to http://localhost:3000
- [ ] Verify Auth0 login works
- [ ] Verify Navbar displays with logo, account selector, language selector, user profile
- [ ] Verify Sidebar shows navigation menu (Início, Usuários, Contas, Configurações)
- [ ] Click each menu item and verify active state (teal background)
- [ ] Change account in selector - verify it updates
- [ ] Change language - verify UI strings change
- [ ] Click logout button - verify logout works

**Step 3: Take screenshot and commit**

```bash
# If all tests pass
git add .
git commit -m "test: verify Phase 1 Layout Shell working correctly"
```

---

## Phase 2: Users Page (Complete CRUD Feature)

### Task 2.1: Install Additional shadcn Components

**Files:**
- Create: `templates/react/src/components/ui/table.tsx`
- Create: `templates/react/src/components/ui/input.tsx`
- Create: `templates/react/src/components/ui/sheet.tsx`
- Create: `templates/react/src/components/ui/checkbox.tsx`
- Create: `templates/react/src/components/ui/toast.tsx`
- Create: `templates/react/src/components/ui/textarea.tsx`
- Create: `templates/react/src/components/ui/skeleton.tsx`
- Create: `templates/react/src/components/ui/alert-dialog.tsx`

**Step 1: Install Table component**

```bash
npx shadcn@latest add table
```

**Step 2: Install Input component**

```bash
npx shadcn@latest add input
```

**Step 3: Install Sheet component (for Drawer)**

```bash
npx shadcn@latest add sheet
```

**Step 4: Install Checkbox component**

```bash
npx shadcn@latest add checkbox
```

**Step 5: Install Toast component**

```bash
npx shadcn@latest add toast
```

**Step 6: Install Textarea component**

```bash
npx shadcn@latest add textarea
```

**Step 7: Install Skeleton component**

```bash
npx shadcn@latest add skeleton
```

**Step 8: Install Alert Dialog component**

```bash
npx shadcn@latest add alert-dialog
```

**Step 9: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shadcn components for Users page (table, input, sheet, etc)"
```

---

### Task 2.2: Install React Hook Form

**Step 1: Install React Hook Form**

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

**Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add react-hook-form for form validation"
```

---

### Task 2.3: Create TitleBar Component

**Files:**
- Create: `templates/react/src/shared/components/TitleBar.tsx`

**Step 1: Create TitleBar component**

Create `src/shared/components/TitleBar.tsx`:

```typescript
import { Button } from '@/components/ui/button'

export interface TitleBarAction {
  key: string
  text: string
  icon?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

interface TitleBarProps {
  title: string
  actions?: TitleBarAction[]
}

export function TitleBar({ title, actions }: TitleBarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold capitalize">{title}</h1>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant={action.variant || 'default'}
              size={action.size || 'default'}
              disabled={action.disabled}
              onClick={action.onClick}
              className="whitespace-nowrap"
            >
              {action.icon && (
                <span className="material-icons mr-2">{action.icon}</span>
              )}
              {action.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/shared/components/TitleBar.tsx
git commit -m "feat: create TitleBar component for page headers"
```

---

### Task 2.4: Create UsersPage Component

**Files:**
- Create: `templates/react/src/features/users/pages/UsersPage.tsx`

**Step 1: Create UsersPage skeleton**

Create `src/features/users/pages/UsersPage.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitleBar, TitleBarAction } from '@/shared/components/TitleBar'
import { Input } from '@/components/ui/input'
import { UsersTable } from '../components/UsersTable'
import { UserDrawer } from '../components/UserDrawer'
import { useUsers } from '../hooks/useUsers'
import { User } from '../types/user.type'

export function UsersPage() {
  const { t } = useTranslation()
  const {
    users,
    isLoading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10, search: searchQuery })
  }, [searchQuery])

  const titleBarActions: TitleBarAction[] = [
    {
      key: 'add-user',
      text: t('users.addUser'),
      icon: 'add',
      onClick: () => {
        setEditingUser(null)
        setIsDrawerOpen(true)
      },
    },
  ]

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsDrawerOpen(true)
  }

  const handleDelete = async (user: User) => {
    if (confirm(t('users.deleteConfirm'))) {
      await deleteUser(user.id)
      fetchUsers({ page: 1, limit: 10, search: searchQuery })
    }
  }

  const handleSave = async (user: User) => {
    if (editingUser) {
      await updateUser(user.id, user)
    } else {
      await createUser(user)
    }
    setIsDrawerOpen(false)
    fetchUsers({ page: 1, limit: 10, search: searchQuery })
  }

  return (
    <div className="main-container">
      <TitleBar title={t('users.title')} actions={titleBarActions} />

      <Input
        type="search"
        placeholder={t('common.search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 max-w-sm"
      />

      <UsersTable
        users={users}
        isLoading={isLoading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={(page) => fetchUsers({ page, limit: 10, search: searchQuery })}
      />

      <UserDrawer
        open={isDrawerOpen}
        user={editingUser}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/users/pages/UsersPage.tsx
git commit -m "feat: create UsersPage component skeleton"
```

---

### Task 2.5: Create useUsers Hook

**Files:**
- Create: `templates/react/src/features/users/hooks/useUsers.ts`

**Step 1: Create useUsers hook**

Create `src/features/users/hooks/useUsers.ts`:

```typescript
import { useState } from 'react'
import { usersApi } from '../api/usersApi'
import { User } from '../types/user.type'

interface UsersQueryParams {
  page: number
  limit: number
  search?: string
}

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })

  const fetchUsers = async (params: UsersQueryParams) => {
    setIsLoading(true)
    try {
      const response = await usersApi.getAll(params)
      setUsers(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (user: Partial<User>) => {
    try {
      await usersApi.create(user)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      await usersApi.update(id, user)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await usersApi.delete(id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  }

  return {
    users,
    isLoading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
```

**Step 2: Commit**

```bash
git add src/features/users/hooks/useUsers.ts
git commit -m "feat: create useUsers hook for data fetching and mutations"
```

---

### Task 2.6: Create UsersTable Component

**Files:**
- Create: `templates/react/src/features/users/components/UsersTable.tsx`

**Step 1: Create UsersTable component**

Create `src/features/users/components/UsersTable.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from '../types/user.type'

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  pagination: PaginationMeta
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onPageChange: (page: number) => void
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}: UsersTableProps) {
  const { t } = useTranslation()

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>{t('users.noUsers')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('users.name')}</TableHead>
            <TableHead>{t('users.email')}</TableHead>
            <TableHead>{t('users.updatedAt')}</TableHead>
            <TableHead>{t('users.deletedAt')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{formatDate(user.updatedAt)}</span>
                  {user.createdAt && (
                    <span className="text-xs text-gray-500">
                      {t('common.createdAt')} {formatDate(user.createdAt)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(user.deletedAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <span className="material-icons">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                  >
                    <span className="material-icons text-red-600">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {t('table.showingNofN', {
            min: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
            max: Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            ),
            total: pagination.totalItems,
          })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/users/components/UsersTable.tsx
git commit -m "feat: create UsersTable component with pagination"
```

---

### Task 2.7: Create UserDrawer Component

**Files:**
- Create: `templates/react/src/features/users/components/UserDrawer.tsx`

**Step 1: Create UserDrawer component**

Create `src/features/users/components/UserDrawer.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, UserPermission } from '../types/user.type'

interface UserDrawerProps {
  open: boolean
  user: User | null
  onClose: () => void
  onSave: (user: User) => void
}

export function UserDrawer({ open, user, onClose, onSave }: UserDrawerProps) {
  const { t } = useTranslation()
  const isEditing = !!user?.id
  const [permissions, setPermissions] = useState<UserPermission[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {},
  })

  useEffect(() => {
    if (user) {
      reset(user)
      setPermissions(user.userAccounts?.map(ua => ({
        accountId: ua.account.id,
        accountName: ua.account.name,
        role: ua.role,
      })) || [])
    } else {
      reset({})
      setPermissions([])
    }
  }, [user, reset])

  const handleAddPermission = () => {
    setPermissions([...permissions, { accountId: '', accountName: '', role: 'reader' }])
  }

  const handleRemovePermission = (index: number) => {
    setPermissions(permissions.filter((_, i) => i !== index))
  }

  const onSubmit = (data: User) => {
    onSave({
      ...data,
      userAccounts: permissions.map(p => ({
        account: { id: p.accountId, name: p.accountName },
        role: p.role,
      })),
    })
    reset()
    setPermissions([])
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[40%] sm:max-w-none overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full gap-4">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? t('users.editUser') : t('users.inviteUser')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('users.name')} *</Label>
              <Input
                id="name"
                {...register('name', { required: t('users.validation.name') })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('users.email')} *</Label>
              <Input
                id="email"
                type="email"
                disabled={isEditing}
                {...register('email', { required: t('users.validation.email') })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Is Super Admin */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSuperAdmin"
                checked={watch('isSuperAdmin')}
                onCheckedChange={(checked) => setValue('isSuperAdmin', checked as boolean)}
              />
              <Label htmlFor="isSuperAdmin">{t('users.isSuperAdmin')}</Label>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('users.permissions')}</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddPermission}
                >
                  <span className="material-icons">add</span>
                </Button>
              </div>
              {permissions.map((permission, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={permission.accountId}
                    onValueChange={(value) => {
                      const newPermissions = [...permissions]
                      newPermissions[index].accountId = value
                      setPermissions(newPermissions)
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t('users.selectAccount')} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Load accounts from API */}
                      <SelectItem value="account1">Account 1</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={permission.role}
                    onValueChange={(value) => {
                      const newPermissions = [...permissions]
                      newPermissions[index].role = value
                      setPermissions(newPermissions)
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reader">Reader</SelectItem>
                      <SelectItem value="writer">Writer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePermission(index)}
                  >
                    <span className="material-icons text-red-600">delete</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/users/components/UserDrawer.tsx
git commit -m "feat: create UserDrawer component for user forms"
```

---

### Task 2.8: Add User i18n Translations

**Files:**
- Modify: `templates/react/src/app/i18n/locales/pt.ts`
- Modify: `templates/react/src/app/i18n/locales/en.ts`

**Step 1: Add Portuguese translations**

Add to `src/app/i18n/locales/pt.ts`:

```typescript
export default {
  // ... existing translations

  users: {
    title: 'Usuários',
    addUser: 'Adicionar Usuário',
    inviteUser: 'Convidar Usuário',
    editUser: 'Editar Usuário',
    deleteConfirm: 'Tem certeza que deseja excluir este usuário?',
    name: 'Nome',
    email: 'Email',
    updatedAt: 'Data de atualização',
    deletedAt: 'Data de exclusão',
    createdAt: 'criado em',
    isSuperAdmin: 'É Super Admin',
    permissions: 'Permissões do Usuário por Conta',
    selectAccount: 'Selecionar conta',
    noUsers: 'Nenhum usuário encontrado',
    validation: {
      name: 'Nome é obrigatório',
      email: 'Email é obrigatório',
    },
  },

  common: {
    search: 'Pesquisar',
    cancel: 'Cancelar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    actions: 'Ações',
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
    success: 'Operação realizada com sucesso',
    previous: 'Anterior',
    next: 'Próximo',
    createdAt: 'criado em',
  },

  table: {
    itemsPerPage: 'Itens por página',
    showingNofN: 'Mostrando {{min}} a {{max}} de {{total}}',
    noItemFound: 'Nenhum item encontrado',
    noResultsFound: 'Nenhum resultado encontrado',
  },
}
```

**Step 2: Add English translations**

Add to `src/app/i18n/locales/en.ts`:

```typescript
export default {
  // ... existing translations

  users: {
    title: 'Users',
    addUser: 'Add User',
    inviteUser: 'Invite User',
    editUser: 'Edit User',
    deleteConfirm: 'Are you sure you want to delete this user?',
    name: 'Name',
    email: 'Email',
    updatedAt: 'Updated at',
    deletedAt: 'Deleted at',
    createdAt: 'created at',
    isSuperAdmin: 'Is Super Admin',
    permissions: 'User Permissions per Account',
    selectAccount: 'Select account',
    noUsers: 'No users found',
    validation: {
      name: 'Name is required',
      email: 'Email is required',
    },
  },

  common: {
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    actions: 'Actions',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Operation completed successfully',
    previous: 'Previous',
    next: 'Next',
    createdAt: 'created at',
  },

  table: {
    itemsPerPage: 'Items per page',
    showingNofN: 'Showing {{min}} to {{max}} of {{total}}',
    noItemFound: 'No items found',
    noResultsFound: 'No results found',
  },
}
```

**Step 3: Commit**

```bash
git add src/app/i18n/locales/pt.ts src/app/i18n/locales/en.ts
git commit -m "feat: add i18n translations for Users feature"
```

---

### Task 2.9: Test Phase 2 - Users Page

**Step 1: Start development server**

```bash
pnpm dev
```

**Step 2: Manual testing checklist**

- [ ] Navigate to /users
- [ ] Verify page header displays "Usuários" with "Adicionar Usuário" button
- [ ] Verify search input is visible
- [ ] Verify users table loads with data
- [ ] Verify table columns: Nome, Email, Data de atualização, Data de exclusão, Ações
- [ ] Click "Adicionar Usuário" - verify drawer opens from right (40% width)
- [ ] Fill form and save - verify user is created
- [ ] Click edit icon - verify drawer opens with pre-filled data
- [ ] Update user and save - verify changes persist
- [ ] Click delete icon - verify confirmation dialog appears
- [ ] Confirm delete - verify user is removed from table
- [ ] Test search - verify table filters by name or email
- [ ] Test pagination - verify next/previous buttons work

**Step 3: Take screenshot and commit**

```bash
# If all tests pass
git add .
git commit -m "test: verify Phase 2 Users Page working correctly"
```

---

## Phase 3: Accounts Page (Complete CRUD Feature)

### Task 3.1: Create AccountsPage Component

**Files:**
- Create: `templates/react/src/features/accounts/pages/AccountsPage.tsx`

**Step 1: Create AccountsPage component**

Create `src/features/accounts/pages/AccountsPage.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitleBar, TitleBarAction } from '@/shared/components/TitleBar'
import { Input } from '@/components/ui/input'
import { AccountsTable } from '../components/AccountsTable'
import { AccountDrawer } from '../components/AccountDrawer'
import { useAccounts } from '../hooks/useAccounts'
import { Account } from '../types/account.type'

export function AccountsPage() {
  const { t } = useTranslation()
  const {
    accounts,
    isLoading,
    pagination,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  useEffect(() => {
    fetchAccounts({ page: 1, limit: 10, search: searchQuery })
  }, [searchQuery])

  const titleBarActions: TitleBarAction[] = [
    {
      key: 'add-account',
      text: t('accounts.addAccount'),
      icon: 'add',
      onClick: () => {
        setEditingAccount(null)
        setIsDrawerOpen(true)
      },
    },
  ]

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setIsDrawerOpen(true)
  }

  const handleDelete = async (account: Account) => {
    if (confirm(t('accounts.deleteConfirm'))) {
      await deleteAccount(account.id)
      fetchAccounts({ page: 1, limit: 10, search: searchQuery })
    }
  }

  const handleSave = async (account: Account) => {
    if (editingAccount) {
      await updateAccount(account.id, account)
    } else {
      await createAccount(account)
    }
    setIsDrawerOpen(false)
    fetchAccounts({ page: 1, limit: 10, search: searchQuery })
  }

  return (
    <div className="main-container">
      <TitleBar title={t('accounts.title')} actions={titleBarActions} />

      <Input
        type="search"
        placeholder={t('common.search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 max-w-sm"
      />

      <AccountsTable
        accounts={accounts}
        isLoading={isLoading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={(page) => fetchAccounts({ page, limit: 10, search: searchQuery })}
      />

      <AccountDrawer
        open={isDrawerOpen}
        account={editingAccount}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/accounts/pages/AccountsPage.tsx
git commit -m "feat: create AccountsPage component"
```

---

### Task 3.2: Create useAccounts Hook

**Files:**
- Create: `templates/react/src/features/accounts/hooks/useAccounts.ts`

**Step 1: Create useAccounts hook**

Create `src/features/accounts/hooks/useAccounts.ts`:

```typescript
import { useState } from 'react'
import { accountsApi } from '../api/accountsApi'
import { Account } from '../types/account.type'

interface AccountsQueryParams {
  page: number
  limit: number
  search?: string
}

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })

  const fetchAccounts = async (params: AccountsQueryParams) => {
    setIsLoading(true)
    try {
      const response = await accountsApi.getAll(params)
      setAccounts(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createAccount = async (account: Partial<Account>) => {
    try {
      await accountsApi.create(account)
    } catch (error) {
      console.error('Failed to create account:', error)
      throw error
    }
  }

  const updateAccount = async (id: string, account: Partial<Account>) => {
    try {
      await accountsApi.update(id, account)
    } catch (error) {
      console.error('Failed to update account:', error)
      throw error
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      await accountsApi.delete(id)
    } catch (error) {
      console.error('Failed to delete account:', error)
      throw error
    }
  }

  return {
    accounts,
    isLoading,
    pagination,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}
```

**Step 2: Commit**

```bash
git add src/features/accounts/hooks/useAccounts.ts
git commit -m "feat: create useAccounts hook for accounts data management"
```

---

### Task 3.3: Create AccountsTable Component

**Files:**
- Create: `templates/react/src/features/accounts/components/AccountsTable.tsx`

**Step 1: Create AccountsTable component**

Create `src/features/accounts/components/AccountsTable.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Account } from '../types/account.type'

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface AccountsTableProps {
  accounts: Account[]
  isLoading: boolean
  pagination: PaginationMeta
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
  onPageChange: (page: number) => void
}

export function AccountsTable({
  accounts,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}: AccountsTableProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>{t('accounts.noAccounts')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('accounts.name')}</TableHead>
            <TableHead>{t('accounts.description')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell>{account.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(account)}
                  >
                    <span className="material-icons">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(account)}
                  >
                    <span className="material-icons text-red-600">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {t('table.showingNofN', {
            min: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
            max: Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            ),
            total: pagination.totalItems,
          })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/accounts/components/AccountsTable.tsx
git commit -m "feat: create AccountsTable component"
```

---

### Task 3.4: Create AccountDrawer Component

**Files:**
- Create: `templates/react/src/features/accounts/components/AccountDrawer.tsx`

**Step 1: Create AccountDrawer component**

Create `src/features/accounts/components/AccountDrawer.tsx`:

```typescript
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Account } from '../types/account.type'

interface AccountDrawerProps {
  open: boolean
  account: Account | null
  onClose: () => void
  onSave: (account: Account) => void
}

export function AccountDrawer({ open, account, onClose, onSave }: AccountDrawerProps) {
  const { t } = useTranslation()
  const isEditing = !!account?.id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Account>({
    defaultValues: account || {},
  })

  useEffect(() => {
    if (account) {
      reset(account)
    } else {
      reset({ name: '', domain: '', description: '' })
    }
  }, [account, reset])

  const onSubmit = (data: Account) => {
    onSave(data)
    reset()
  }

  const validateDomain = (value: string) => {
    const domainRegex = /^(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/
    return domainRegex.test(value) || t('accounts.validation.domain')
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[40%] sm:max-w-none overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full gap-4">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? t('accounts.editAccount') : t('accounts.addAccount')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4">
            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('accounts.accountName')} *</Label>
              <Input
                id="name"
                disabled={isEditing}
                {...register('name', {
                  required: t('accounts.validation.name'),
                  minLength: {
                    value: 3,
                    message: t('accounts.validation.minLength', { min: 3 }),
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Account Domain */}
            <div className="space-y-2">
              <Label htmlFor="domain">{t('accounts.accountDomain')} *</Label>
              <Input
                id="domain"
                {...register('domain', {
                  required: t('accounts.validation.domain'),
                  validate: validateDomain,
                })}
              />
              {errors.domain && (
                <p className="text-sm text-red-600">{errors.domain.message}</p>
              )}
            </div>

            {/* Account Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('accounts.accountDescription')} *</Label>
              <Textarea
                id="description"
                rows={4}
                {...register('description', {
                  required: t('accounts.validation.description'),
                  minLength: {
                    value: 3,
                    message: t('accounts.validation.minLength', { min: 3 }),
                  },
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/accounts/components/AccountDrawer.tsx
git commit -m "feat: create AccountDrawer component with domain validation"
```

---

### Task 3.5: Add Accounts i18n Translations

**Files:**
- Modify: `templates/react/src/app/i18n/locales/pt.ts`
- Modify: `templates/react/src/app/i18n/locales/en.ts`

**Step 1: Add Portuguese translations**

Add to `src/app/i18n/locales/pt.ts`:

```typescript
export default {
  // ... existing translations

  accounts: {
    title: 'Contas',
    addAccount: 'Adicionar Conta',
    editAccount: 'Editar Conta',
    deleteConfirm: 'Tem certeza que deseja excluir esta conta?',
    name: 'Nome',
    description: 'Descrição',
    accountName: 'Nome da Conta',
    accountDomain: 'Domínio da Conta',
    accountDescription: 'Descrição da Conta',
    noAccounts: 'Nenhuma conta encontrada',
    validation: {
      name: 'Nome é obrigatório',
      domain: 'Domínio é obrigatório e deve ser válido',
      description: 'Descrição é obrigatória',
      minLength: 'Mínimo de {{min}} caracteres',
    },
  },
}
```

**Step 2: Add English translations**

Add to `src/app/i18n/locales/en.ts`:

```typescript
export default {
  // ... existing translations

  accounts: {
    title: 'Accounts',
    addAccount: 'Add Account',
    editAccount: 'Edit Account',
    deleteConfirm: 'Are you sure you want to delete this account?',
    name: 'Name',
    description: 'Description',
    accountName: 'Account Name',
    accountDomain: 'Account Domain',
    accountDescription: 'Account Description',
    noAccounts: 'No accounts found',
    validation: {
      name: 'Name is required',
      domain: 'Domain is required and must be valid',
      description: 'Description is required',
      minLength: 'Minimum {{min}} characters',
    },
  },
}
```

**Step 3: Commit**

```bash
git add src/app/i18n/locales/pt.ts src/app/i18n/locales/en.ts
git commit -m "feat: add i18n translations for Accounts feature"
```

---

### Task 3.6: Test Phase 3 - Accounts Page

**Step 1: Start development server**

```bash
pnpm dev
```

**Step 2: Manual testing checklist**

- [ ] Navigate to /accounts
- [ ] Verify page header displays "Contas" with "Adicionar Conta" button
- [ ] Verify accounts table loads with data
- [ ] Click "Adicionar Conta" - verify drawer opens
- [ ] Fill form with invalid domain - verify validation error
- [ ] Fill form correctly and save - verify account is created
- [ ] Click edit icon - verify drawer opens with pre-filled data
- [ ] Verify name field is disabled when editing
- [ ] Update description and save - verify changes persist
- [ ] Click delete icon - verify confirmation and deletion works
- [ ] Test search functionality

**Step 3: Take screenshot and commit**

```bash
# If all tests pass
git add .
git commit -m "test: verify Phase 3 Accounts Page working correctly"
```

---

## Phase 4: Settings Page

### Task 4.1: Create SettingsPage Component

**Files:**
- Create: `templates/react/src/features/settings/pages/SettingsPage.tsx`

**Step 1: Create simple settings page**

Create `src/features/settings/pages/SettingsPage.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { TitleBar } from '@/shared/components/TitleBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function SettingsPage() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="main-container">
      <TitleBar title={t('settings.title')} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.languagePreferences')}</CardTitle>
            <CardDescription>{t('settings.languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.accountInfo')}</CardTitle>
            <CardDescription>{t('settings.accountDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {t('settings.moreComingSoon')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Step 2: Install Card component**

```bash
npx shadcn@latest add card
npx shadcn@latest add label
```

**Step 3: Add settings translations**

Add to `src/app/i18n/locales/pt.ts`:

```typescript
settings: {
  title: 'Configurações',
  languagePreferences: 'Preferências de Idioma',
  languageDescription: 'Selecione o idioma de sua preferência',
  language: 'Idioma',
  accountInfo: 'Informações da Conta',
  accountDescription: 'Gerenciar suas configurações de conta',
  moreComingSoon: 'Mais opções em breve...',
},
```

Add to `src/app/i18n/locales/en.ts`:

```typescript
settings: {
  title: 'Settings',
  languagePreferences: 'Language Preferences',
  languageDescription: 'Select your preferred language',
  language: 'Language',
  accountInfo: 'Account Information',
  accountDescription: 'Manage your account settings',
  moreComingSoon: 'More options coming soon...',
},
```

**Step 4: Commit**

```bash
git add src/features/settings/ src/app/i18n/ src/components/ui/card.tsx src/components/ui/label.tsx
git commit -m "feat: create Settings page with language preferences"
```

---

## Final Tasks

### Task Final.1: Update Template Package.json

**Files:**
- Modify: `templates/react/package.json`

**Step 1: Verify all dependencies are in package.json**

Check that package.json includes:
- react-hook-form
- @hookform/resolvers
- zod
- All shadcn components

**Step 2: Run build to verify**

```bash
cd templates/react
pnpm build
```

Expected: Build succeeds with no errors

**Step 3: Commit if changes needed**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update dependencies after Phase 4 completion"
```

---

### Task Final.2: Update Documentation

**Files:**
- Modify: `templates/react/README.md`
- Modify: `CLAUDE.md`

**Step 1: Update React README**

Add section about shadcn/ui setup and component usage

**Step 2: Update CLAUDE.md**

Update React frontend section to mention:
- shadcn/ui components
- Layout structure (Navbar + Sidebar)
- Drawer pattern for forms
- Server-side pagination

**Step 3: Commit**

```bash
git add templates/react/README.md CLAUDE.md
git commit -m "docs: update documentation for React layout redesign"
```

---

### Task Final.3: Full Integration Test

**Step 1: Clean test**

```bash
# Remove any test frontend
rm -rf apps/frontend-react

# Add fresh from template
bash scripts/add-react.sh
```

**Step 2: Start both backend and frontend**

```bash
# Terminal 1
cd apps/backend && pnpm dev

# Terminal 2
cd apps/frontend-react && pnpm dev
```

**Step 3: Complete integration test**

- [ ] Login via Auth0
- [ ] Verify layout renders correctly (Navbar + Sidebar)
- [ ] Navigate through all pages (Home, Users, Accounts, Settings)
- [ ] Test Users CRUD: Create, Read, Update, Delete
- [ ] Test Accounts CRUD: Create, Read, Update, Delete
- [ ] Change account in navbar - verify context updates
- [ ] Change language - verify all strings translate
- [ ] Test search functionality on Users and Accounts
- [ ] Test pagination on Users and Accounts
- [ ] Logout and verify redirect

**Step 4: Take screenshots and commit**

```bash
git add .
git commit -m "test: complete integration test - all features working"
```

---

### Task Final.4: Push to GitHub

**Step 1: Push branch**

```bash
git push origin add-react-into-the-stack
```

**Step 2: Verify on GitHub**

- Check that all commits are pushed
- Verify templates/react has updated files
- Verify documentation is updated

---

## Success Criteria

All tasks complete when:
- [ ] Layout shell renders with Navbar + Sidebar
- [ ] All navigation links work and show active state
- [ ] Users page: Full CRUD with search and pagination
- [ ] Accounts page: Full CRUD with search and pagination
- [ ] Settings page: Language selection works
- [ ] Account switching updates context throughout app
- [ ] Language switching translates all UI strings
- [ ] All forms use Drawer (Sheet) component from right
- [ ] Form validation works (client-side)
- [ ] Visual design matches Vue application (teal colors, spacing, typography)
- [ ] Mobile-responsive (tested on desktop first, as per Vue)
- [ ] No TypeScript errors
- [ ] Build succeeds without warnings

---

## Notes

- Use `@superpowers:executing-plans` to implement this plan task-by-task
- Commit after each task completion
- Test thoroughly after each phase
- Reference Vue application for exact styling and behavior
- Keep DRY principles - reuse components where possible
- Follow YAGNI - don't add features beyond requirements
