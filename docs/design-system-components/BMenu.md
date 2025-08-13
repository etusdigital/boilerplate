# Name: b-menu
## Component Overview

**Purpose**: A vertical navigation menu component with expandable/collapsible layout, icon support, and flexible routing integration for building application sidebars and navigation systems.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div class="h-screen flex">
        <b-menu 
            v-model="selectedItem"
            :expanded="isExpanded"
            :items="menuItems"
        />
        <main class="flex-1 p-base">
            <h1>Selected: {{ selectedItem }}</h1>
        </main>
    </div>
</template>

<script setup lang="ts">

const selectedItem = ref("dashboard")
const isExpanded = ref(true)
const menuItems = ref([...])
</script>
```

---

### Props API

#### v-model
Controls the selected menu item value or object. Type: `any` (default: `undefined`)

#### expanded
Controls whether the menu is expanded to show labels. Type: `boolean` (default: `false`)

#### items
Array of menu items with navigation and display properties. Type: `Item[]` (required)

```typescript
type Item = {
  label: string;       // Display text for the menu item
  value: string;       // Unique identifier for the item
  icon?: string;       // Icon name to display
  path?: string;       // Navigation path/route
  disabled?: boolean;  // Whether the item is disabled
  bottom?: boolean;    // Whether to position at bottom of menu
  items?: Item[];      // Nested menu items (for sub-menus)
}
```

#### get-object
Returns the complete item object instead of just the value. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a menu item is selected. Receives either the item value or complete object based on `get-object` prop.

### Slots API

This component uses internal MenuOption components and doesn't expose custom slots for item rendering.

### Integration with b-side-menu

The BMenu component can be integrated with BSideMenu to handle nested menu items and sub-navigation. When using `get-object="true"`, the selected menu item can contain nested items that are displayed in a secondary navigation panel.

```vue
<template>
    <div class="flex h-screen">
        <b-menu 
            v-model="selectedMenuItem"
            :expanded="menuExpanded"
            :items="mainMenuItems"
            get-object
        />
        <b-side-menu
            v-if="selectedMenuItem?.items"
            :items="selectedMenuItem.items"
            :parent-path="selectedMenuItem.path"
            :get-object="true"
        />
        <main class="flex-1 p-base">
            Page
        </main>
    </div>
</template>

<script setup lang="ts">

const mainMenuItems = ref([
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
    },
    ...
])

const selectedMenuItem = ref(mainMenuItems.value[1])
const menuExpanded = ref(true)
</script>
```

This integration pattern is ideal for:
- **Admin panels** with multiple management sections
- **Multi-level navigation** systems
- **Hierarchical content** organization
- **Complex applications** with nested feature sets

---

**Important Notes:**
- Automatic routing integration with Vue Router and Nuxt Link detection
- Responsive height calculation based on navbar presence for optimal layout
- Icon-only mode when collapsed with tooltip support for better UX
- Bottom positioning support for logout, settings, and help items
- Disabled state prevents interaction while maintaining visual consistency
- Path normalization ensures proper navigation regardless of input format
- Selected state management with visual highlighting of active items
- Flexible return value (object vs value) for different use cases
- Automatic current route detection and selection on component mount
- CSS custom properties for dynamic height calculation
- Border and spacing optimized for sidebar layouts
- Z-index management for proper layering in complex layouts
- Integration with BSideMenu component for handling nested menu items and sub-navigation
- Support for hierarchical menu structures with 2 nesting levels
- Seamless coordination between primary and secondary navigation panels