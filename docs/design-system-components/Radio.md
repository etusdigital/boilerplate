# Name: Radio
## Component Overview

**Purpose**: A radio button component with support for groups, visual variants, and accessibility features for single-choice selection scenarios.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Radio 
        v-model="isSelected"
        name="radioGroup"
    >
      Test radio
    </Radio>
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
Value used when radio is part of a Group component. Type: `any` (default: `undefined`)

#### disabled
Disables radio button interaction. Type: `boolean` (default: `false`)

#### variant
Visual styling variant for different contexts. Type: `'default' | 'onboarding'` (default: `"default"`)

---

### Events API

#### @update:model-value
Triggered when the radio button selection state changes.

### Slots API

#### #default
Content displayed next to the radio button circle.

```vue
<template>
    <Radio v-model="selected" name="options">
       Slot: default
    </Radio>
</template>

<script setup lang="ts">

const selected = ref(false)
</script>
```

**Important Notes:**
- Automatically integrates with Group component for grouped radio selections
- Supports keyboard navigation with Space key activation
- Provides proper ARIA attributes for screen reader accessibility
- Label element automatically associates with input when name/id is provided
- Onboarding variant provides larger sizing for better visibility in guided flows
- Disabled state prevents interaction while maintaining visual feedback
- Single radio buttons behave as toggles, while grouped radios enforce single selection