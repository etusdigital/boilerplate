# @boilerplate/ui-react

Shared React UI components package for the boilerplate monorepo.

## What's Included

### UI Components (shadcn/ui)
- Alert Dialog
- Avatar
- Button
- Checkbox
- Dropdown Menu
- Input
- Label
- Select
- Sheet
- Skeleton
- Sonner (Toast notifications)
- Table
- Textarea
- Tooltip

### Shared Business Components
- **TablePagination**: Reusable pagination with page numbers and ellipsis
- **TitleBar**: Page header with action buttons
- **SortableTableHead**: Sortable table header cells

### Utilities
- **cn()**: Tailwind utility class merger
- **CSS Theme**: Complete TailwindCSS v4 theme with CSS variables

## Usage

### In React Template

```typescript
import { Button, Table, TablePagination, TitleBar } from '@boilerplate/ui-react'
import '@boilerplate/ui-react/styles'

function MyComponent() {
  return (
    <div>
      <TitleBar title="My Page" actions={[...]} />
      <Table>...</Table>
    </div>
  )
}
```

### In Next.js Template

```typescript
import { Button, Table, TablePagination, TitleBar } from '@boilerplate/ui-react'
import '@boilerplate/ui-react/styles'

export default function MyPage() {
  return (
    <div>
      <TitleBar title="My Page" actions={[...]} />
      <Table>...</Table>
    </div>
  )
}
```

## Design System

All components use the centralized TailwindCSS theme defined in `src/assets/main.css` with CSS custom properties:

- `--color-primary`: Custom green for save/primary actions
- `--color-destructive`: Red for delete/destructive actions
- `--color-border`: Border color
- And many more...

## Peer Dependencies

This package uses peer dependencies to avoid version conflicts. Each template controls the exact versions of:
- React & React DOM
- Radix UI components
- Utility libraries (CVA, clsx, tailwind-merge)

## Maintenance

When updating UI components:
1. Make changes in this package
2. Both React and Next.js templates automatically inherit the changes
3. No need to duplicate updates across templates
