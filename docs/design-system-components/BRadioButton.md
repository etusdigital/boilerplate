# Name: b-radio-button
## Component Overview

**Purpose**: A button-style radio component with two visual variants for creating toggleable button groups and card-style selections.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-radio-button 
        v-model="isSelected"
        name="buttonGroup"
    >
      Test radio
    </b-radio-button>
</template>

<script setup lang="ts">

const isSelected = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the radio button selection state. Type: `boolean` (default: `false`)

#### id
Unique identifier for the radio button element. Type: `string` (default: `undefined`)

#### name
Name attribute for form grouping and accessibility. Type: `string` (default: `undefined`)

#### group-value
Value used when radio is part of a BGroup component. Type: `any` (default: `undefined`)

#### disabled
Disables radio button interaction. Type: `boolean` (default: `false`)

#### is-div
Switches to card-style variant with different styling. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the radio button selection state changes.

### Slots API

#### #default
Content displayed inside the radio button.

```vue
<template>
    <b-radio-button v-model="selected" name="options">
        Slot: default
    </b-radio-button>
</template>

<script setup lang="ts">

const selected = ref(false)
</script>
```

**Important Notes:**
- Provides two distinct visual styles: button and card variants
- Automatically integrates with BGroup component for grouped selections
- Supports keyboard navigation with Space key activation
- Provides proper ARIA attributes for screen reader accessibility
- Button variant ideal for toggle groups and action selections
- Card variant (is-div) perfect for option cards and feature selections
- Disabled state prevents interaction while maintaining visual feedback
- Minimum sizing ensures consistent layout across different content lengths