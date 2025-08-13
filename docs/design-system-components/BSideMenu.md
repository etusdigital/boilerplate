# Name: b-side-menu
## Component Overview

**Purpose**: A vertical navigation sidebar component with hierarchical menu support, automatic route detection, and flexible item positioning for application navigation.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-side-menu 
        v-model="selectedItem"
        :items="menuItems"
    />
</template>

<script setup lang="ts">

const selectedItem = ref("home")

const menuItems = ref([
    ...
    {
        label: "Projects",
        value: "projects",
        path: "/projects",
        icon: "folder",
        items: [
            {
                label: "All Projects",
                value: "all-projects",
                path: "/all",
            },
            {
                label: "Internal",
                value: "internal",
                path: "/internal",
            },
            {
                label: "External",
                value: "external",
                path: "/external",
            },
        ],
    }
    ...
])
</script>
```

---

### Props API

#### v-model
Controls the selected menu item value. Type: `any` (default: `""`)

#### items
Array of menu item objects defining the navigation structure. Type: `MenuItem[]` (required)

```typescript
type MenuItem = {
  label: string;       // Display text for the step item
  value: string;       // Unique identifier for the item
  icon: string;        // Icon name for the step item
}
```

#### parent-path
Base path prefix applied to all menu items. Type: `string` (default: `""`)

#### get-object
Returns the complete item object instead of just the value when true. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a menu item is selected. Receives the selected value or object based on `get-object` prop.

---

### Slots API

This component uses internal `Item` components and doesn't expose custom slots.

**Important Notes:**
- Automatically detects and selects items based on current route path
- Height adjusts dynamically based on navbar presence
- Supports 1 nesting levels for complex navigation structures
- Bottom items are separated and positioned at the menu bottom
- Disabled items maintain visual feedback but prevent interaction
- Parent path concatenation enables modular menu composition
- Selection state automatically propagates through nested item hierarchies