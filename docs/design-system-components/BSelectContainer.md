# Name: b-select-container
## Component Overview

**Purpose**: A graphical template component providing a select-like visual style with expandable content. Used internally to build other select components and exported for custom implementations.

**Import**: Automatic - no need to import any DS components

**BSelectContainer** is meant to provide a graphical template for other components that have a visual style similar to a select component. We use this internally to build a few other components, but also export it in case you need to build something similar that isn't in the DS.

### Basic Usage

```vue
<template>
    <b-select-container v-model="isOpen" label-value="Custom Select">
        <BIcon name="sentiment_satisfied" />
        <span class="truncate">Select container example</span>
        
        <template #items>
            <li tabindex="0">Item 1</li>
            <li tabindex="0">Item 2</li>
            <li tabindex="0">Item 3</li>
            <li tabindex="0">Item 4</li>
        </template>

        <template #actions>
            <b-button size="small" variant="plain">Clear</b-button>
            <b-button size="small">Apply</b-button>
        </template>
    </b-select-container>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

---

### Props API

#### v-model
Controls whether the dropdown is expanded. Type: `boolean` (default: `false`)

#### label-value
The label displayed above the select container. Type: `string` (default: `""`)

#### role
ARIA role for accessibility. Type: `string` (default: `"listbox"`)

#### absolute
Makes the dropdown content have absolute positioning. Type: `boolean` (default: `false`)

#### required
Marks the field as required for form validation. Type: `boolean` (default: `false`)

#### disabled
Disables the entire component. Type: `boolean` (default: `false`)

#### is-error
Activates error visual state. Type: `boolean` (default: `false`)

#### error-message
Error message displayed when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed below the component. Type: `string` (default: `""`)

#### secondary
Applies secondary styling theme. Type: `boolean` (default: `false`)

#### hide-arrow
Hides the dropdown arrow indicator. Type: `boolean` (default: `false`)

#### close-on-blur
Closes the dropdown when focus moves outside. Type: `boolean` (default: `true`)

#### dont-have-max-height
Removes max height constraints for fitting sub-items. Type: `boolean` (default: `false`)

#### max-height
Maximum height of the select area excluding dropdown. Type: `string` (default: `"40px"`)

#### min-width
Minimum width of the component. Type: `string` (default: `"15em"`)

#### disable-label-auto-width
Prevents automatic label width calculation. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the expanded state changes.

### Slots API

#### #default
The main content displayed in the select area (the "trigger" area).

#### #content
Replaces the entire dropdown content area.

```vue
<template>
    <b-select-container v-model="isOpen" label-value="Custom Content">
        <span class="truncate">Select container example</span>
        <template #content>
            <div>Slot: content</div>
        </template>
    </b-select-container>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

#### #items
List items displayed in the dropdown content area.

#### #actions
Action buttons displayed at the bottom of the dropdown.

**Important Notes:**
- Built on top of BExpandableContainer for consistent behavior
- Automatically handles dropdown positioning and transitions
- Uses ResizeObserver for dynamic content height calculation
- Supports both absolute and relative positioning for dropdown content
- Provides full accessibility support with proper ARIA roles