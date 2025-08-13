# Name: b-toggle
## Component Overview

**Purpose**: A toggle switch component with customizable positioning and accessibility features for binary state control with visual feedback and keyboard navigation support.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-toggle 
        v-model="isEnabled"
    >
        Toggle Label
    </b-toggle>
</template>

<script setup lang="ts">

const isEnabled = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the toggle state (on/off). Type: `boolean` (default: `false`)

#### id
HTML id attribute for the toggle element. Type: `string` (default: `undefined`)

#### name
HTML name attribute for form integration. Type: `string` (default: `undefined`)

#### rhs
Positions the toggle switch on the right-hand side of the label. Type: `boolean` (default: `false`)

#### disabled
Disables the toggle interaction. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the toggle state changes. Receives the new boolean value.

### Slots API

#### #default
Content displayed as the toggle label next to the switch.

```vue
<template>
    <b-toggle v-model="setting">
        Slot: default
    </b-toggle>
</template>

<script setup lang="ts">

const setting = ref(false)
</script>
```

**Important Notes:**
- Full keyboard accessibility with Space key activation and proper ARIA attributes
- Smooth animation transitions for state changes with optimal timing
- Automatic label association when id or name props are provided
- Visual disabled state prevents interaction while maintaining clear feedback
- Right-hand side positioning option for flexible layout integration
- Switch role and aria-checked attributes for screen reader compatibility
- Focus management with tabindex and keyboard event handling
- Consistent sizing and color theming across all interaction states