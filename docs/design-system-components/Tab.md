# Name: Tab
## Component Overview

**Purpose**: A tab navigation component with support for text and icon modes, flexible sizing, and card or plain styling variants for organizing content sections.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Tab 
        v-model="selectedTab"
        :options="tabs"
    />
</template>

<script setup lang="ts">

const selectedTab = ref(null)
const tabs = [...]
</script>
```

---

### Props API

#### v-model
Controls the currently selected tab. Type: `any` (default: `undefined`)

#### options
Array of tab options. Can be strings or objects with label, value, and icon properties. Type: `any[]` (required)

#### label-key
Property name used for displaying option labels when using object arrays. Type: `string` (default: `"label"`)

#### value-key
Property name used for option values when using object arrays. Type: `string` (default: `"value"`)

#### is-icon
Displays icons instead of text labels. Type: `boolean` (default: `false`)

#### not-card
Removes card wrapper styling for a plain appearance. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selected tab changes. Receives the selected tab option.

### Slots API

This component uses internal rendering for tab options and doesn't expose custom slots.

**Important Notes:**
- Automatically selects the first tab if no initial value is provided
- Supports both string arrays and object arrays with configurable properties
- Icon mode displays Material Icons by name
- Card styling provides elevated appearance with background and shadow
- Plain styling (not-card) offers minimal visual styling for inline use
- Responsive design adapts tab widths based on content and container
- Smooth hover effects and active state transitions for better user experience