# Name: Switch
## Component Overview

**Purpose**: A switch component with customizable positioning and accessibility features for binary state control with visual feedback and keyboard navigation support.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Switch 
        v-model="isEnabled"
    >
        Switch Label
    </Switch>
</template>

<script setup lang="ts">

const isEnabled = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the switch state (on/off). Type: `boolean` (default: `false`)

#### id
HTML id attribute for the switch element. Type: `string` (default: `undefined`)

#### name
HTML name attribute for form integration. Type: `string` (default: `undefined`)

#### rhs
Positions the switch button on the right-hand side of the label. Type: `boolean` (default: `false`)

#### disabled
Disables the switch interaction. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the switch state changes. Receives the new boolean value.

### Slots API

#### #default
Content displayed as the switch label next to the switch.

```vue
<template>
    <Switch v-model="setting">
        Slot: default
    </Switch>
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