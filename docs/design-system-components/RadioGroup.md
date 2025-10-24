# Name: RadioGroup
## Component Overview

**Purpose**: A container component for grouping related input components with synchronized selection state, commonly used for radio button groups and visual component grouping.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <RadioGroup v-model="selectedValue" :options="options" />
</template>

<script setup lang="ts">

const selectedValue = ref('option1')
const options = ref([...])
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

#### options
Array of objects or primitive values to render as radio options. Type: `any[]` (required)

#### label-key
Property name to use as display label when options are objects. Type: `string` (default: `"label"`)

#### value-key
Property name to use as option value when options are objects. Type: `string` (default: `"value"`)

#### get-object
Whether to emit the full object instead of just the value when selection changes. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selection changes within the group.

### Slots API

This component uses `Radio` internally and doesn't expose custom slots.

**Important Notes:**
- Model value synchronization works bidirectionally between RadioGroup and child components
- Use `vertical` prop to change layout orientation for all grouped components