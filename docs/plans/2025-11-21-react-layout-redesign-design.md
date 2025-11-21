# React Layout Redesign - Design Document

**Date**: 2025-11-21
**Status**: Approved
**Goal**: Replicate Vue application's layout and design system in React using shadcn/ui

---

## Overview

The React frontend currently lacks the design system and layout structure present in the Vue application. This redesign will recreate the exact layout, components, and user experience from Vue using shadcn/ui component library and TailwindCSS.

## Problem Statement

Current React implementation:
- ❌ No layout structure (just basic routing)
- ❌ Missing Navbar with logo, account selector, language selector, user profile
- ❌ No Sidebar navigation
- ❌ No design system components (modals, tables, forms)
- ❌ Different visual appearance from Vue application

Target Vue implementation:
- ✅ Complete layout with Navbar + Sidebar
- ✅ Design system components from `@etus/design-system`
- ✅ Account switching, language selection, user profile display
- ✅ Data tables with search, pagination, CRUD operations
- ✅ Modal forms with validation
- ✅ Consistent teal/green color scheme

---

## Architecture

### Component Hierarchy

```
App
├── RouterProvider
    ├── Layout (protected routes)
    │   ├── Navbar
    │   │   ├── Logo + "Boilerplate" text
    │   │   ├── AccountSelect (shadcn Select)
    │   │   ├── LanguageSelect (shadcn Select)
    │   │   └── UserProfile
    │   │       ├── Avatar (shadcn Avatar)
    │   │       ├── Name + Email display
    │   │       └── Logout button
    │   ├── Sidebar
    │   │   └── Navigation Menu Items
    │   │       ├── Início (home)
    │   │       ├── Usuários (users)
    │   │       └── Contas (accounts)
    │   └── Main Content Area
    │       └── <Outlet /> (router content)
    └── Public routes
        ├── CallbackPage
        └── NotFoundPage
```

### Technology Stack

- **UI Library**: shadcn/ui (unstyled, accessible components)
- **Styling**: TailwindCSS v4
- **State Management**: Zustand (existing)
- **Routing**: React Router v6 (existing)
- **Icons**: Material Icons (matching Vue)
- **Forms**: React Hook Form (to be added)
- **i18n**: react-i18next (existing)

### Design Tokens

```css
/* Colors */
--primary: #14B8A6 (teal-500)
--primary-hover: #0D9488 (teal-600)
--background: #F8F9FA
--text-primary: #1F2937
--text-secondary: #6B7280
--border: #E5E7EB

/* Layout */
--navbar-height: 64px
--sidebar-width: 280px
--content-padding: 24px

/* Spacing */
--space-sm: 8px
--space-base: 16px
--space-lg: 24px
```

---

## Implementation Approach: Feature-by-Feature

### Phase 1: Layout Shell (Navbar + Sidebar + Routing)

**Objective**: Create the foundational layout structure that wraps all authenticated pages.

**Tasks**:
1. Initialize shadcn/ui in the project
   ```bash
   npx shadcn@latest init
   ```

2. Install initial shadcn components:
   - `Button`
   - `Avatar`
   - `Select` (for account and language selection)
   - `Dropdown Menu` (for user profile menu)

3. Create `Layout` component:
   ```tsx
   src/app/components/Layout.tsx
   - Navbar at top (sticky, 64px height)
   - Sidebar on left (280px width, sticky)
   - Main content area (flex-1, padding)
   ```

4. Build `Navbar` component:
   - **Left section**: Logo (etus-logo.ico) + "Boilerplate" text
   - **Center section**: Account selector dropdown
   - **Right section**: Language selector + User profile + Logout button
   - Styling: White background, border-bottom, shadow-sm

5. Build `Sidebar` component:
   - Navigation menu items with icons and labels
   - Active route highlighting (teal background)
   - Icons from Material Icons (home, people, business)
   - Route metadata for menu generation

6. Update routing:
   ```tsx
   - Protected routes wrapped by <Layout>
   - Public routes (callback, 404) outside layout
   ```

7. Update Zustand store:
   - Add `selectedAccount` state
   - Add `changeAccount()` action
   - Add `currentLanguage` state
   - Add `setLanguage()` action

**Acceptance Criteria**:
- [ ] Navbar displays with logo, selectors, and user profile
- [ ] Sidebar shows navigation menu with active state
- [ ] Layout is responsive (desktop-first, like Vue)
- [ ] Account switching updates header display
- [ ] Language switching changes UI strings
- [ ] Logout button works correctly

---

### Phase 2: Users Page (Complete CRUD Feature)

**Objective**: Implement a fully functional Users management page with table, search, and modal forms.

**Tasks**:
1. Install shadcn components:
   - `Table`
   - `Input`
   - `Dialog`
   - `Checkbox`
   - `Toast` (for notifications)

2. Create `UsersPage` component:
   ```tsx
   src/features/users/pages/UsersPage.tsx
   - Page header with title and "Adicionar Usuário" button
   - Search input (with search icon)
   - Data table component
   - Pagination controls
   ```

3. Create `UsersTable` component:
   - Columns: Nome, Email, Data de atualização, Data de exclusão
   - Row actions: Edit (pencil icon), Delete (trash icon)
   - Hover effects on rows
   - Empty state: "Nenhum usuário encontrado"

4. Create `UserFormModal` component:
   - Title: "Convidar Usuário" (create) / "Editar Usuário" (edit)
   - Form fields:
     - Nome (text input, required)
     - Email (email input, required)
     - É Super Admin (checkbox)
     - Permissões do Usuário por Conta (section with + button)
   - Form validation with React Hook Form
   - Actions: "Cancelar" (outline) + "Salvar" (teal solid)

5. Implement data flow:
   - Fetch users: `GET /users` on component mount
   - Create user: `POST /users` → show success toast → refresh table
   - Edit user: `PUT /users/:id` → update table optimistically
   - Delete user: Show confirm dialog → `DELETE /users/:id` → remove from table
   - Search: Filter users client-side by name or email

6. Add loading and error states:
   - Skeleton loader for table while fetching
   - Spinner button state during form submission
   - Error toast for API failures
   - Form field error messages

**Acceptance Criteria**:
- [ ] Users table displays all users with correct columns
- [ ] Search filters users by name or email
- [ ] "Adicionar Usuário" opens modal with empty form
- [ ] Edit icon opens modal with pre-filled data
- [ ] Delete icon shows confirmation before deletion
- [ ] Form validation prevents invalid submissions
- [ ] Success/error toasts appear for all operations
- [ ] Table updates immediately after CRUD operations
- [ ] Pagination works if more than 10 users

---

### Phase 3: Accounts Page (Complete CRUD Feature)

**Objective**: Implement Accounts management page similar to Users page.

**Tasks**:
1. Create `AccountsPage` component:
   - Same structure as UsersPage
   - "Adicionar Conta" button

2. Create `AccountsTable` component:
   - Columns: Nome, Descrição
   - Row actions: Edit, Delete

3. Create `AccountFormModal` component:
   - Title: "Adicionar Conta" / "Editar Conta"
   - Form fields:
     - Nome da Conta (required)
     - Domínio da Conta (required)
     - Descrição da Conta (textarea, required)
   - Same validation and submission flow as Users

4. Implement CRUD operations:
   - `GET /accounts`
   - `POST /accounts`
   - `PUT /accounts/:id`
   - `DELETE /accounts/:id`

**Acceptance Criteria**:
- [ ] Accounts table displays all accounts
- [ ] Create/edit/delete operations work correctly
- [ ] Form validation matches backend requirements
- [ ] UI matches Users page design consistency

---

### Phase 4: Settings Page

**Objective**: Create user settings page for preferences.

**Tasks**:
1. Create `SettingsPage` component:
   - User preferences section
   - Language selection (same as navbar)
   - Account management options
   - Theme settings (if applicable)

2. Simple form layout with sections:
   - Profile settings
   - Notification preferences
   - System preferences

**Acceptance Criteria**:
- [ ] Settings page displays user preferences
- [ ] Changes are saved to backend
- [ ] UI is clean and organized

---

## Error Handling Strategy

### API Errors
- Use toast notifications (shadcn Toast or Sonner) for all API errors
- Display user-friendly error messages
- Log detailed errors to console for debugging

### Form Validation
- **Client-side**: Real-time validation with error messages under inputs
  - Required fields: "Este campo é obrigatório"
  - Email format: "Digite um email válido"
  - Custom rules per field
- **Server-side**: Display backend validation errors from API response
  - Map error keys to form fields
  - Show general error toast if unmapped errors

### Network Errors
- Retry mechanism for failed requests (3 attempts)
- Loading states during requests
- Timeout handling (30 seconds)

### 404 / Unauthorized
- Redirect to NotFound page for invalid routes
- Redirect to login if token expires
- Show appropriate error messages

---

## Loading & Empty States

### Loading States
- **Table skeleton**: Show skeleton rows while fetching data
- **Button spinner**: Show spinner during form submission
- **Page loader**: Full-page spinner for initial app load

### Empty States
- **No data**: "Nenhum usuário encontrado" with icon
- **No search results**: "Nenhum resultado para '{query}'"
- **No accounts**: "Você não possui contas cadastradas"

---

## Testing Approach

### Component Tests (React Testing Library)
- Test each UI component in isolation
- Mock data and API calls
- Test user interactions (clicks, form submissions)
- Test loading, error, and empty states

**Example**:
```typescript
describe('UsersTable', () => {
  it('displays users correctly', () => {...})
  it('shows empty state when no users', () => {...})
  it('calls onEdit when edit icon clicked', () => {...})
})
```

### Integration Tests
- Test complete user flows
- Test Users CRUD flow end-to-end
- Test Accounts CRUD flow
- Test account switching in navbar

### E2E Tests (Optional, Playwright)
- Critical user journeys
- Login → Navigate → Create User → Logout
- Account switching functionality

---

## Internationalization (i18n)

### Strategy
- Keep existing `react-i18next` setup
- All UI strings must use `t('key')` function
- Match Portuguese translations from Vue app

### New Translation Keys Needed
```typescript
// Navbar
"navbar.logout": "Sair"
"navbar.selectAccount": "Selecionar conta"
"navbar.selectLanguage": "Selecionar idioma"

// Users
"users.title": "Usuários"
"users.addUser": "Adicionar Usuário"
"users.inviteUser": "Convidar Usuário"
"users.editUser": "Editar Usuário"
"users.deleteConfirm": "Tem certeza que deseja excluir este usuário?"
"users.name": "Nome"
"users.email": "Email"
"users.isSuperAdmin": "É Super Admin"
"users.permissions": "Permissões do Usuário por Conta"
"users.noUsers": "Nenhum usuário encontrado"

// Accounts
"accounts.title": "Contas"
"accounts.addAccount": "Adicionar Conta"
"accounts.accountName": "Nome da Conta"
"accounts.accountDomain": "Domínio da Conta"
"accounts.accountDescription": "Descrição da Conta"
"accounts.noAccounts": "Nenhuma conta encontrada"

// Common
"common.search": "Pesquisar"
"common.cancel": "Cancelar"
"common.save": "Salvar"
"common.edit": "Editar"
"common.delete": "Excluir"
"common.loading": "Carregando..."
"common.error": "Ocorreu um erro"
"common.success": "Operação realizada com sucesso"
```

---

## Migration from Current React App

### Files to Modify
1. `src/app/App.tsx` - Add Layout wrapper
2. `src/app/router/index.tsx` - Restructure routes with Layout
3. `src/app/stores/mainStore.ts` - Add account/language state
4. `src/features/users/pages/UsersPage.tsx` - Complete redesign
5. `src/features/accounts/pages/AccountsPage.tsx` - Complete redesign

### Files to Create
1. `src/app/components/Layout.tsx`
2. `src/app/components/Navbar.tsx`
3. `src/app/components/Sidebar.tsx`
4. `src/features/users/components/UsersTable.tsx`
5. `src/features/users/components/UserFormModal.tsx`
6. `src/features/accounts/components/AccountsTable.tsx`
7. `src/features/accounts/components/AccountFormModal.tsx`
8. `src/shared/components/ConfirmDialog.tsx`

### shadcn Components to Install
```bash
npx shadcn@latest add button
npx shadcn@latest add avatar
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add checkbox
npx shadcn@latest add toast
npx shadcn@latest add skeleton
```

---

## Success Criteria

### Visual Match
- [ ] Layout structure identical to Vue app
- [ ] Colors match design tokens (teal primary)
- [ ] Spacing and typography consistent
- [ ] Icons and imagery match

### Functional Match
- [ ] All CRUD operations work
- [ ] Account switching updates context
- [ ] Language switching changes UI
- [ ] Search and pagination work
- [ ] Modals and forms function correctly

### Code Quality
- [ ] TypeScript strict mode with no errors
- [ ] All components have proper types
- [ ] Reusable components extracted
- [ ] No duplicate code
- [ ] Following React best practices

### Testing
- [ ] Component tests pass
- [ ] Integration tests cover main flows
- [ ] No console errors or warnings

### Documentation
- [ ] README updated with new setup instructions
- [ ] Component documentation (JSDoc)
- [ ] CLAUDE.md updated with React patterns

---

## Timeline Estimate

- **Phase 1** (Layout Shell): ~4-6 hours
- **Phase 2** (Users Page): ~6-8 hours
- **Phase 3** (Accounts Page): ~3-4 hours
- **Phase 4** (Settings Page): ~2-3 hours
- **Testing & Polish**: ~3-4 hours

**Total**: ~18-25 hours of development time

---

## Open Questions

None - design approved and ready for implementation.

---

## References

- Vue Application Screenshots (provided)
- shadcn/ui Documentation: https://ui.shadcn.com
- TailwindCSS v4: https://tailwindcss.com
- React Router v6: https://reactrouter.com
- Zustand: https://zustand-demo.pmnd.rs
