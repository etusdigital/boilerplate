# Name: Toggle
## Component Overview

**Purpose**: A button-style toggle component with two visual variants for creating toggleable button groups and card-style selections.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Toggle 
        v-model="isSelected"
        name="buttonGroup"
    >
      Test toggle
    </Toggle>
</template>

<script setup lang="ts">

const isSelected = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the toggle button selection state. Type: `boolean` (default: `false`)

#### id
Unique identifier for the toggle button element. Type: `string` (default: `undefined`)

#### name
Name attribute for form grouping and accessibility. Type: `string` (default: `undefined`)

#### group-value
Value used when toggle is part of a Group component. Type: `any` (default: `undefined`)

#### disabled
Disables toggle button interaction. Type: `boolean` (default: `false`)

#### type
Visual variant of the toggle button. Type: `'default' | 'secondary'` (default: `'default'`)

---

### Events API

#### @update:model-value
Triggered when the toggle button selection state changes.

### Slots API

#### #default
Content displayed inside the toggle button.

```vue
<template>
    <Toggle v-model="selected" name="options">
        Slot: default
    </Toggle>
</template>

<script setup lang="ts">

const selected = ref(false)
</script>
```

**Important Notes:**
- Provides two distinct visual styles: default and secondary variants
- Automatically integrates with Group component for grouped selections
- Supports keyboard navigation with Space key activation
- Provides proper ARIA attributes for screen reader accessibility
- Default variant ideal for standard toggle groups and action selections
- Secondary variant features rounded corners and different styling for card-like selections
- Disabled state prevents interaction while maintaining visual feedback
- Minimum sizing ensures consistent layout across different content lengths