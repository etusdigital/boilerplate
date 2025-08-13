# Name: b-pagination
## Component Overview

**Purpose**: A pagination component with intelligent page display logic, navigation controls, and responsive ellipsis handling for large page sets.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-pagination 
        v-model="currentPage"
        :length="totalPages"
    />
</template>

<script setup lang="ts">

const currentPage = ref(1)
const totalPages = ref(10)
</script>
```

---

### Props API

#### v-model
Controls the current active page number. Type: `number` (default: `1`)

#### length
Total number of pages available for navigation. Type: `number` (default: `1`)

---

### Events API

#### @update:model-value
Triggered when the current page changes. Receives the new page number and additional context.

### Slots API

This component uses internal logic for page display and doesn't expose custom slots.

**Important Notes:**
- Automatically handles ellipsis (...) for large page sets with intelligent positioning
- Navigation arrows are disabled at first/last pages to prevent invalid navigation
- Smart page display algorithm shows relevant pages around current selection
- Always displays first and last pages for quick navigation
- Hover effects and visual feedback for better user experience
- Responsive design adapts to different page ranges automatically
- Optimized rendering prevents unnecessary DOM updates for performance