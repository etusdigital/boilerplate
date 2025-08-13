# Name: b-collapse
## Component Overview

**Purpose**: A collapsible content component with smooth animations and customizable header sections for organizing content in expandable panels.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-collapse v-model="isOpen">
        <template #header>
            <h4 class="text-neutral-foreground-high">Collapse component</h4>
        </template>
        <div class="flex items-end justify-start gap-base">
            <p>
                Lorem ipsum dolor sit amet consectetur. Ultricies urna mattis purus maecenas
                amet hac viverra id feugiat. Et dui maecenas at dui. Sagittis phasellus a
                massa praesent ultricies.
            </p>
        </div>
    </b-collapse>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the collapse state (open/closed). Type: `boolean` (default: `false`)

#### duration
Controls the animation duration in milliseconds. Type: `number` (default: `150`, min: `150`, max: `1000`)

#### no-shadow
Removes the card shadow and border. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the collapse state changes.

### Slots API

#### #default
The collapsible content that appears when the component is expanded.

```vue
<template>
    <b-collapse v-model="isOpen">
        <template #header>Form Section</template>
        
        Slot: default
    </b-collapse>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

#### #header
Content displayed in the collapse header section, next to the expand/collapse icon.

```vue
<template>
    <b-collapse v-model="isOpen">
        <template #header>
            Header
        </template>
        <p>Settings content goes here.</p>
    </b-collapse>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

**Important Notes:**
- The component automatically handles smooth height transitions during expand/collapse
- Duration is automatically clamped between 150ms and 1000ms for optimal UX
- Uses ResizeObserver to handle dynamic content height changes