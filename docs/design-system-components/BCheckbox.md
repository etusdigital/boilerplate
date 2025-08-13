# Name: b-checkbox
## Component Overview

**Purpose**: A checkbox input component with support for indeterminate state, flexible positioning, and accessibility features for form controls and selection interfaces.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-checkbox 
        v-model="isChecked"
        id="basic-checkbox"
        name="basic"
    >
        Test label
    </b-checkbox>
</template>

<script setup lang="ts">

const isChecked = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the checkbox state. Type: `boolean | null` (default: `false`)

#### id
HTML id attribute for the checkbox. Type: `string` (optional)

#### name
HTML name attribute for the checkbox. Type: `string` (optional)

#### rhs
Positions the checkbox on the right-hand side. Type: `boolean` (default: `false`)

#### allow-indeterminate
Allows the checkbox to be in an indeterminate state. The `null` value is treated as indeterminate. Type: `boolean` (default: `false`)

#### disabled
Disables the checkbox interaction. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the checkbox state changes.

### Slots API

#### #default
Content displayed next to the checkbox box (typically the label text).

```vue
<template>
    <b-checkbox v-model="isSelected" id="slot-example">
        Slot: default
    </b-checkbox>
</template>
```

**Important Notes:**
- Supports three states: checked (`true`), unchecked (`false`), and indeterminate (`null`)
- Accessible with proper ARIA attributes and keyboard navigation (Space key)
- Label automatically associates with checkbox when `id` or `name` is provided
- Use `rhs` prop for right-aligned layouts (common in settings interfaces)
- Indeterminate state is useful for parent-child checkbox relationships