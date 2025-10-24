# Name: Sidebar
## Component Overview

**Purpose**: A vertical navigation sidebar component with expandable/collapsible layout, icon support, and flexible routing integration for building application sidebars and navigation systems.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div class="h-screen flex">
        <Sidebar 
            v-model="selectedOption"
            :expanded="isExpanded"
            :options="sidebarOptions"
        />
        <main class="flex-1 p-base">
            <h1>Selected: {{ selectedOption }}</h1>
        </main>
    </div>
</template>

<script setup lang="ts">

const selectedOption = ref("dashboard")
const isExpanded = ref(true)
const sidebarOptions = ref([...])
</script>
```

---

### Props API

#### v-model
Controls the selected sidebar option value or object. Type: `any` (default: `undefined`)

#### expanded
Controls whether the sidebar is expanded to show labels. Type: `boolean` (default: `false`)

#### options
Array of sidebar options with navigation and display properties. Type: `Option[]` (required)

```typescript
type Option = {
  label: string;       // Display text for the sidebar option
  value: string;       // Unique identifier for the option
  icon?: string;       // Icon name to display
  path?: string;       // Navigation path/route
  disabled?: boolean;  // Whether the option is disabled
  bottom?: boolean;    // Whether to position at bottom of sidebar
  options?: Option[];  // Nested sidebar options
}
```

#### get-object
Returns the complete option object instead of just the value. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a sidebar option is selected. Receives either the option value or complete object based on `get-object` prop.

### Slots API

This component uses internal SidebarOption components and doesn't expose custom slots for option rendering.

---

**Important Notes:**
- Automatic routing integration with Vue Router and Nuxt Link detection
- Responsive height calculation based on navbar presence for optimal layout
- Icon-only mode when collapsed with tooltip support for better UX
- Bottom positioning support for logout, settings, and help options
- Disabled state prevents interaction while maintaining visual consistency
- Path normalization ensures proper navigation regardless of input format
- Selected state management with visual highlighting of active options
- Flexible return value (object vs value) for different use cases
- Automatic current route detection and selection on component mount
- CSS custom properties for dynamic height calculation
- Border and spacing optimized for sidebar layouts
- Z-index management for proper layering in complex layouts
- Support for hierarchical sidebar structures with 3 nesting levels
- Seamless coordination between primary and secondary navigation panels