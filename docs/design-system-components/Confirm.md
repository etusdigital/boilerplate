# Name: confirm
## Function Overview

**Purpose**: A programmatic confirmation dialog function that displays modal dialogs for user confirmation, returning a promise that resolves based on user interaction for critical action validation.

**Usage**: Function-based API - no direct component import needed

**Import**: Import it using inject function `inject('confirm')`

<br />
### Basic Usage

```vue
<template>
   <button @click="handleDelete">Delete Item</button>
</template>

<script setup lang="ts">

const confirm = inject('confirm') as Function

const handleDelete = async () => {
    const result = await confirm({
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        acceptLabel: 'Delete',
        cancelLabel: 'Cancel'
    })
    
    if (result) {
        console.log('Item deleted')
    }
}
</script>
```

---

### Function API

#### confirm(options)
Displays a confirmation dialog and returns a promise that resolves to a boolean.

**Parameters**: `ConfirmOptions` (required)

```typescript
type ConfirmOptions = {
  title?: string;      // Dialog title text
  message: string;     // Main confirmation message
  acceptLabel: string;  // Accept button label
  cancelLabel: string;  // Cancel button label
}
```

**Returns**: `Promise<boolean>`
- `true` when user clicks accept button
- `false` when user clicks cancel button or closes dialog

#### Access Methods

**Composition API (Recommended)**
```javascript

const confirm = inject('confirm') as Function
```

**Options API (Legacy)**
```javascript
this.$confirm({
    title: 'Confirmation',
    message: 'Proceed with action?',
    acceptLabel: 'Yes',
    cancelLabel: 'No'
})
```

---

### Usage Patterns

#### Async/Await Pattern
```javascript
const handleCriticalAction = async () => {
    const confirmed = await confirm({
        title: 'Critical Action',
        message: 'This will permanently delete all data. Continue?',
        acceptLabel: 'Yes, Delete All',
        cancelLabel: 'Cancel'
    })
    
    if (confirmed) {
        await performCriticalAction()
    }
}
```

#### Promise Chain Pattern
```javascript
const handleAction = () => {
    confirm({
        message: 'Save changes before leaving?',
        acceptLabel: 'Save',
        cancelLabel: 'Discard'
    }).then((result) => {
        if (result) {
            saveChanges()
        }
        navigateAway()
    })
}
```

### Setup Requirements

#### Component Registration
The `<confirm />` component must be included **only once** in your application root, preferably in `App.vue`:

```vue
<!-- App.vue -->
<template>
    <!-- Your app content -->
    <router-view />
    
    <!-- Required for confirm dialogs - Add only once -->
    <confirm />
</template>
```

**Important**: Do not add `<confirm />` to individual components. It should only be present once in your entire application.

#### Service Injection
The confirm function is available through Vue's dependency injection system and requires proper setup in your application configuration.

---

### Event System

The confirm dialog uses an internal event system to communicate between the function call and the dialog component:

- **Function Call** → Triggers `open-confirm` event
- **User Action** → Triggers `confirm` or `cancel` events
- **Promise Resolution** → Based on user choice

**Important Notes:**
- Returns `Promise<boolean>` for easy async/await usage
- Modal dialog prevents outside clicks when active
- Only one confirmation dialog can be active at a time
- Requires `<confirm />` component in application root **only once** (preferably in App.vue)
- Uses dependency injection for clean API access
- Handles both accept and cancel scenarios gracefully
- No direct component props - all configuration through function parameters