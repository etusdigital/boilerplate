# Name: b-stepper
## Component Overview

**Purpose**: A multi-step navigation component with two visual styles, progress tracking, and customizable step validation for creating guided workflows and multi-step forms.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-stepper 
        v-model="currentStep"
        :items="steps"
    />
</template>

<script setup lang="ts">

const currentStep = ref(...)
const steps = ref([...])
</script>
```

---

### Props API

#### v-model
Controls the currently active step. Type: `any` (default: `undefined`)

#### items
Array of step items that can be strings or objects. Type: `any[]` (required)

#### label-key
Property name used for displaying item labels when using object arrays. Type: `string` (default: `"label"`)

#### value-key
Property name used for item values when using object arrays. Type: `string` (default: `"value"`)

#### size
Controls the stepper size variant. Type: `'medium' | 'large'` (default: `'medium'`)

#### disabled
Disables step navigation when true. Type: `boolean` (default: `false`)

#### allowed-skip
Allows users to skip steps and jump to any step. Type: `boolean` (default: `false`)

#### background
Custom background color for the stepper. Type: `string` (default: `"var(--neutral-background-default)"`)

#### version
Stepper visual style version. Type: `1 | 2` (default: `1`)

**Version Differences:**
- **Version 1**: Horizontal breadcrumb-style with arrow connectors
- **Version 2**: Circular steps with icons and connecting lines

#### get-object
Returns the complete item object instead of just the value when true. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the active step changes (v-model). Receives the new step value.

#### @change-step
Triggered when any step interaction occurs. Receives the step item and index.

```vue
<template>
    <b-stepper 
        v-model="currentStep"
        :items="steps"
        disabled
        @change-step="handleStepChange"
    />
</template>

<script setup lang="ts">

const toast = inject("toast") as Function;

const currentStep = ref(...)
const steps = ref([...])
const attr = ref(...)

const handleStepChange = (item, index) => {
    if (!isValid()) {
        toast({...})
        return
    }

    if (index != steps.length - 1) currentStep = steps[index + 1]
    else save()
}

const isValid = () => {}
const save = () => {}
</script>
```

---

### Slots API

This component doesn't expose custom slots. Content is controlled through the `items` prop.

**Important Notes:**
- Automatically tracks step progression and prevents skipping unless `allowed-skip` is enabled
- Version 2 requires objects with `icon` property for proper display
- Step validation prevents users from jumping ahead unless explicitly allowed
- Custom background colors apply to button backgrounds and maintain visual consistency
- Progress tracking persists even when users navigate backwards
- Component automatically initializes to first step if no model value is provided