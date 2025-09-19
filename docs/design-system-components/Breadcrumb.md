# Name: Breadcrumb
## Component Overview

**Purpose**: A navigation breadcrumb component with intelligent truncation, expandable overflow menus, and smart positioning for displaying hierarchical page structures and navigation paths.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Breadcrumb 
        v-model="currentPage"
        :options="navigationPath"
    />
</template>

<script setup lang="ts">

const currentPage = ref("Settings")
const navigationPath = ["Home", "Dashboard", "Profile", "Settings"]
</script>
```

---

### Props API

#### v-model
Controls the currently selected breadcrumb option. Type: `any` (default: `undefined`)

#### options
Array of breadcrumb navigation options. Can be strings or objects. Type: `any[]` (default: `undefined`)

#### label-key
Property name used for displaying option labels when using object arrays. Type: `string` (default: `"label"`)

#### value-key
Property name used for option values when using object arrays. Type: `string` (default: `"value"`)

#### get-object
Returns complete objects instead of just values when enabled. Type: `boolean` (default: `false`)

### Events API

#### @update:model-value
Triggered when a breadcrumb option is clicked. Receives the selected value based on `get-object` setting.

### Slots API

This component uses internal rendering for breadcrumb options and doesn't expose custom slots.

**Important Notes:**
- Intelligent truncation algorithm shows first, last, and options around current selection
- Expandable "more" menus with smart viewport positioning to prevent overflow
- Automatic scroll detection and menu dismissal for better user experience
- Portal rendering for overflow menus prevents z-index conflicts and ensures proper layering
- Smooth animations for menu open/close transitions with optimal timing
- Click-outside handling with scroll-aware behavior for intuitive menu management
- Responsive design adapts breadcrumb display based on available space and content length
- Accessibility support with proper navigation semantics and keyboard interaction patterns