# Name: ToggleGroup
## Component Overview

**Purpose**: A container component for grouping related input components with synchronized selection state, commonly used for toggle button groups and visual component grouping.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <ToggleGroup v-model="selectedValue" :options="options" />
    
    <p>Selected: {{ selectedValue }}</p>
</template>

<script setup lang="ts">

const selectedValue = ref('option1')
const options = [...]
</script>
```

---

### Props API

#### v-model
Controls the currently selected component's group-value. Type: `any` (default: `null`)

#### vertical
Arranges grouped components vertically instead of horizontally. Type: `boolean` (default: `false`)

#### disabled
Disables all grouped components. Type: `boolean` (default: `false`)

#### type
Visual variant applied to all toggle buttons in the group. Type: `'default' | 'secondary'` (default: `'default'`)

---

### Events API

#### @update:model-value
Triggered when the selection changes within the group.

### Slots API

This component uses `Toggle` internally and doesn't expose custom slots.

**Important Notes:**
- Model value synchronization works bidirectionally between ToggleGroup and child components
- Use `vertical` prop to change layout orientation for all grouped components