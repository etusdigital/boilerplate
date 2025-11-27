# Template Maintenance Guide

This guide explains how to maintain and develop the boilerplate templates in-place without needing to copy them to the `apps/` directory.

## Overview

The boilerplate includes three frontend templates in the `templates/` directory:
- **React**: `templates/react/` - Pure React 18 with Zustand
- **Vue**: `templates/vue/` - Vue 3 with Pinia
- **Next.js**: `templates/nextjs/` - Next.js 15 with App Router

All React-based templates (React and Next.js) share components from the `@boilerplate/ui-react` package located in `packages/ui-react/`.

## Architecture

```
/
├── packages/
│   └── ui-react/              # Shared UI components for React/Next.js
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/        # 14 shadcn/ui components
│       │   │   └── shared/    # 3 business components
│       │   ├── lib/           # Utilities (cn function)
│       │   └── assets/        # TailwindCSS theme
│       └── package.json       # Uses peer dependencies
├── templates/
│   ├── react/                 # React template (uses @boilerplate/ui-react)
│   ├── vue/                   # Vue template (independent)
│   └── nextjs/                # Next.js template (uses @boilerplate/ui-react)
└── pnpm-workspace.yaml        # Includes templates/* in workspace
```

## Development Workflow

### Running Templates Locally

You can run any template directly from the `templates/` directory using the provided npm scripts:

```bash
# Run React template
pnpm run dev:template:react

# Run Vue template
pnpm run dev:template:vue

# Run Next.js template
pnpm run dev:template:nextjs
```

These scripts will:
1. Navigate to the template directory
2. Install dependencies (if needed)
3. Start the development server

**Ports:**
- React: `http://localhost:3000`
- Vue: `http://localhost:3000`
- Next.js: `http://localhost:3000`

### Making Changes to Shared Components

When modifying components in `packages/ui-react/`:

1. **Edit the component** in `packages/ui-react/src/components/`
2. **No rebuild needed** - Vite/Next.js will hot-reload changes automatically
3. **Both React and Next.js templates** inherit changes immediately

**Example: Updating the Button component**

```bash
# 1. Start React template
pnpm run dev:template:react

# 2. In another terminal, edit the button
# Edit: packages/ui-react/src/components/ui/button.tsx

# 3. Changes appear instantly in the running React template
```

### Making Changes to Framework-Specific Components

When modifying components specific to each template:

**React Template:**
```bash
# Run template
pnpm run dev:template:react

# Edit files in templates/react/src/
# - Layout components: _components/ (Navbar, Sidebar)
# - Features: features/ (Users, Accounts)
# - Configuration: app/lib/, app/auth/
```

**Next.js Template:**
```bash
# Run template
pnpm run dev:template:nextjs

# Edit files in templates/nextjs/
# - Layout components: app/_components/ (Navbar, Sidebar)
# - Features: features/ (Users, Accounts)
# - Configuration: app/_lib/, app/api/auth/
```

**Vue Template:**
```bash
# Run template
pnpm run dev:template:vue

# Edit files in templates/vue/src/
# All components are independent (no shared package)
```

## Component Sharing Strategy

### Shared Components (@boilerplate/ui-react)

**When to add to shared package:**
- Pure presentational UI components (buttons, inputs, tables)
- Business logic components used by both React and Next.js (TablePagination, TitleBar)
- Utilities that don't depend on framework-specific APIs

**How to add a new shared component:**

```bash
# 1. Create component in packages/ui-react/src/components/
#    - ui/ for presentational components
#    - shared/ for business components

# 2. Export from packages/ui-react/src/index.ts
export * from './components/ui/new-component'

# 3. No build step needed - templates import directly from source
# 4. Use immediately in React and Next.js templates
import { NewComponent } from '@boilerplate/ui-react'
```

### Framework-Specific Components

**Keep in each template if:**
- Uses framework-specific hooks (useAuth0 vs useUser, useNavigate vs useRouter)
- Uses framework-specific components (Link from react-router vs next/link)
- Has different server/client rendering requirements

**Examples:**
- **Navbar**: Different auth hooks and routing between React/Next.js
- **Sidebar**: Different Link components
- **Protected Route**: HOC in React vs Server Component in Next.js

## Testing Changes

### Test Individual Template

```bash
# Test React template
pnpm run dev:template:react
# Visit http://localhost:3000
# Test all features: Users, Accounts, Settings
# Verify shared components work correctly

# Test Next.js template
pnpm run dev:template:nextjs
# Visit http://localhost:3000
# Test all features: Users, Accounts, Settings
# Verify shared components work correctly
```

### Test with Backend

Templates need the backend API running for full functionality:

```bash
# Terminal 1: Start backend
cd apps/backend
pnpm dev

# Terminal 2: Start template
pnpm run dev:template:react  # or nextjs, vue
```

**Backend requirements:**
- Running on `http://localhost:3001`
- Auth0 configured in `.env`
- Database migrated and seeded

## Updating Templates After Changes

After making changes to templates, they need to be tested via the installation scripts to ensure the copying process works correctly:

### Test Installation Scripts

```bash
# Test React installation
bash scripts/add-react.sh
# Verify: apps/frontend-react/ created and working

# Test Next.js installation
bash scripts/add-nextjs.sh
# Verify: apps/frontend-nextjs/ created and working

# Test Vue installation
bash scripts/add-vue.sh
# Verify: apps/frontend-vue/ created and working
```

### Verify Copied Templates

```bash
# After running installation script, test the copied version
cd apps/frontend-react  # or frontend-nextjs, frontend-vue
pnpm install
pnpm dev

# Verify:
# - All dependencies installed correctly
# - .env file created from .env.example
# - Dev server starts without errors
# - All features work as expected
```

## Common Maintenance Tasks

### Adding a New Feature

**Scenario**: Add a "Projects" feature to both React and Next.js templates

1. **Identify shared components**
   - Will you use existing shared components? (Table, Pagination, TitleBar)
   - Need new shared components? (Add to packages/ui-react/)

2. **Implement in React template**
   ```bash
   pnpm run dev:template:react
   # Create: templates/react/src/features/projects/
   #   - components/ (ProjectsPage, ProjectsTable, ProjectDrawer)
   #   - api/ (API integration)
   #   - types/ (TypeScript interfaces)
   #   - hooks/ (Custom hooks)
   ```

3. **Implement in Next.js template**
   ```bash
   pnpm run dev:template:nextjs
   # Create: templates/nextjs/features/projects/
   #   - components/ (Same as React)
   #   - api/ (API integration)
   #   - types/ (Same as React)
   ```

4. **Add routes**
   - React: Update `templates/react/src/app/App.tsx`
   - Next.js: Create `templates/nextjs/app/(protected)/projects/page.tsx`

5. **Add navigation**
   - Update Sidebar in both templates
   - Add i18n translations

6. **Test both templates**
   ```bash
   pnpm run dev:template:react
   pnpm run dev:template:nextjs
   ```

### Updating Shared Component

**Scenario**: Update the TitleBar component to support breadcrumbs

1. **Edit shared component**
   ```bash
   # Edit: packages/ui-react/src/components/shared/TitleBar.tsx
   # Add breadcrumbs prop and rendering logic
   ```

2. **Test in React**
   ```bash
   pnpm run dev:template:react
   # Verify changes work in React template
   ```

3. **Test in Next.js**
   ```bash
   pnpm run dev:template:nextjs
   # Verify changes work in Next.js template
   ```

4. **Update usage** in both templates if needed
   ```typescript
   // Both templates automatically get the new props
   <TitleBar
     title="Users"
     breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Users' }]}
   />
   ```

### Adding a New UI Component

**Scenario**: Add a new "Badge" component to shared package

1. **Add to shared package**
   ```bash
   # Create: packages/ui-react/src/components/ui/badge.tsx
   # Follow shadcn/ui pattern with Radix UI primitives
   ```

2. **Export from index**
   ```typescript
   // packages/ui-react/src/index.ts
   export * from './components/ui/badge'
   ```

3. **Add peer dependencies if needed**
   ```json
   // packages/ui-react/package.json
   {
     "peerDependencies": {
       "@radix-ui/react-badge": "^1.0.0"
     }
   }
   ```

4. **Install peer dep in templates**
   ```bash
   # React template
   cd templates/react
   pnpm add @radix-ui/react-badge

   # Next.js template
   cd templates/nextjs
   pnpm add @radix-ui/react-badge
   ```

5. **Use in templates**
   ```typescript
   import { Badge } from '@boilerplate/ui-react'
   ```

## Best Practices

### 1. Component Sharing Guidelines

**✅ DO add to shared package:**
- Pure UI components (Button, Input, Table)
- Reusable business components (Pagination, SortableTableHead)
- Utilities (cn function, formatters)
- CSS theme and styles

**❌ DON'T add to shared package:**
- Framework-specific logic (auth hooks, routing)
- Server Components (Next.js specific)
- Components using framework-specific APIs

### 2. Development Workflow

**✅ DO:**
- Run templates directly from `templates/` directory for development
- Test changes in both React and Next.js when updating shared components
- Use pnpm workspace for automatic linking
- Keep templates synchronized in features and behavior

**❌ DON'T:**
- Copy templates to `apps/` for development (that's for end users)
- Make breaking changes to shared components without testing both templates
- Forget to update both templates when adding features

### 3. Testing

**✅ DO:**
- Test templates with `pnpm run dev:template:*` commands
- Run installation scripts to verify copying works
- Test with backend API running for full integration
- Verify shared components in both templates

**❌ DON'T:**
- Only test in one template when changing shared components
- Skip testing the installation scripts
- Assume changes work without running dev server

### 4. Peer Dependencies

**✅ DO:**
- Use peer dependencies in `packages/ui-react/package.json`
- Install peer deps as regular deps in template `package.json`
- Keep versions in sync across templates

**❌ DON'T:**
- Add dependencies directly to shared package (causes version conflicts)
- Use different versions of peer deps in templates

## Troubleshooting

### Issue: "Cannot find module '@boilerplate/ui-react'"

**Solution:**
```bash
# Ensure workspace includes templates
cat pnpm-workspace.yaml
# Should include: - 'templates/*'

# Reinstall from root
pnpm install

# Try running template again
pnpm run dev:template:react
```

### Issue: Changes to shared components not reflecting

**Solution:**
```bash
# Restart the template dev server
# Vite/Next.js should hot-reload, but sometimes needs restart

# If issue persists, clear cache
rm -rf templates/react/node_modules/.vite
pnpm run dev:template:react
```

### Issue: Peer dependency version conflicts

**Solution:**
```bash
# Check peer dependency versions
cat packages/ui-react/package.json

# Update template package.json to match peer dep versions
cd templates/react  # or nextjs
pnpm add @radix-ui/react-component@^X.X.X

# Reinstall
pnpm install
```

### Issue: Template works in templates/ but fails after installation

**Solution:**
```bash
# Check that installation script copies all necessary files
ls templates/react
ls apps/frontend-react  # after installation

# Verify .env.example is copied
# Verify all src/ files are copied
# Check that package.json is correct

# Test installation script again
rm -rf apps/frontend-react
bash scripts/add-react.sh
```

## Summary

**Key Points:**
1. Templates are part of pnpm workspace (`templates/*` in pnpm-workspace.yaml)
2. Use `pnpm run dev:template:*` to run templates directly from `templates/` directory
3. React and Next.js templates share components via `@boilerplate/ui-react` package
4. Shared package uses peer dependencies to avoid version conflicts
5. Changes to shared components affect both React and Next.js templates automatically
6. Always test both templates when modifying shared components
7. Test installation scripts after making changes to verify copying works correctly

**Quick Reference:**
```bash
# Run templates
pnpm run dev:template:react    # React template
pnpm run dev:template:vue      # Vue template
pnpm run dev:template:nextjs   # Next.js template

# Test installation
bash scripts/add-react.sh      # Install React to apps/
bash scripts/add-vue.sh        # Install Vue to apps/
bash scripts/add-nextjs.sh     # Install Next.js to apps/

# Workspace structure
packages/ui-react/             # Shared React components
templates/react/               # React template
templates/nextjs/              # Next.js template
templates/vue/                 # Vue template
apps/                          # User-installed frontends (gitignored)
```
