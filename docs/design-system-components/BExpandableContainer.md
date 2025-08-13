# Name: b-expandable-container
## Component Overview

**Purpose**: A versatile expandable container component with customizable content areas, absolute positioning options, and comprehensive form integration features for building complex dropdown interfaces and collapsible sections.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-expandable-container 
        v-model="isExpanded"
        label-value="Select Options"
        @update:model-value="handleToggle"
    >
        <BIcon name="sentiment_satisfied" class="text-base shrink-0" />
        <span class="truncate">Container content</span>

        <template #content>
            <div class="p-base min-w-[20em]">
                <div v-for="option in options" :key="option.id" class="p-xs hover:bg-neutral-surface-highlight cursor-pointer">
                    {{ option.label }}
                </div>
            </div>
        </template>
    </b-expandable-container>
</template>

<script setup lang="ts">

const isExpanded = ref(false)
const options = ref([...])

const handleToggle = (value: boolean) => {
    console.log('Container toggled:', value)
}
</script>
```

---

### Props API

#### v-model
Controls the expanded/collapsed state of the container. Type: `boolean` (default: `false`)

#### label-value
The label text displayed in the expandable container header. Type: `string` (default: `""`)

#### absolute
Makes the content dropdown have absolute positioning to prevent layout shifts. Type: `boolean` (default: `false`)

#### disabled
Disables the expandable container interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### close-on-blur
Closes the content box when focus moves outside the component. Type: `boolean` (default: `true`)

#### align-right
Right-aligns the dropdown content (requires absolute positioning). Type: `boolean` (default: `false`)

#### max-height
Maximum height for the container header. Type: `string` (default: `"40px"`)

#### min-width
Minimum width for the container. Type: `string` (default: `"unset"`)

#### min-width-card
Minimum width for the expandable card content area. Type: `string` (default: `""`)

#### secondary
Applies secondary styling variant. Type: `boolean` (default: `false`)

#### hide-arrow
Hides the expand/collapse arrow icon. Type: `boolean` (default: `false`)

#### disable-label-auto-width
Disables automatic width calculation for the label. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the expanded/collapsed state changes. Receives the new state and additional context information.

### Slots API

#### #default
Content displayed in the header area of the expandable container.

#### #content
The expandable content that appears when the container is opened.

#### #complement
Additional content area for supplementary elements in the header.

#### #label
Custom label content to replace the default label-value text.

#### #card
Custom wrapper for the expandable content area, replacing the default card styling.

**Important Notes:**
- Built on top of the internal BContainer component for consistent behavior
- Absolute positioning prevents layout shifts when content expands
- Close-on-blur functionality provides intuitive user interaction patterns
- Automatic content positioning with support for right-alignment
- Smooth expand/collapse animations with configurable timing
- Integration with form validation states and error handling
- Flexible slot system allows complete customization of header and content areas
- Secondary styling variant provides alternative visual contexts
- Arrow visibility control for minimalist interface designs
- Label auto-width calculation ensures optimal space utilization
- Supports complex nested content with proper z-index management
- Compatible with keyboard navigation and accessibility requirements