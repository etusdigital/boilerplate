# Name: b-select
## Component Overview

**Purpose**: A single-selection dropdown component with search functionality, custom item rendering, and flexible configuration for selecting one option from a list. Prefer using `b-smart-select` when available

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-select 
        v-model="selectedItem"
        label-value="label"
        :items="options"
    >
        Placeholder
    </b-select>
</template>

<script setup lang="ts">

const selectedItem = ref(null)
const options = [...]
</script>
```

---

### Props API

#### v-model
Controls the selected item value. Type: `any` (default: `null`)

#### v-model:expanded
Controls the dropdown expanded state. Type: `boolean` (default: `false`)

#### label-value
The label displayed for the select button. Type: `string` (default: `""`)

#### items
Array of options to select from. Can be strings or objects. Type: `any[]` (required)

#### icon
Icon displayed on the select button. Type: `string` (default: `""`)

#### label-key
Property name used for displaying item labels when using object arrays. Type: `string` (default: `"label"`)

#### value-key
Property name used for item values when using object arrays. Type: `string` (default: `"value"`)

#### absolute
Controls absolute positioning of the dropdown. Type: `boolean` (default: `true`)

#### disabled
Disables the select interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### searchable
Enables search functionality within the options. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### secondary
Applies secondary styling variant. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selected item changes. Receives the selected value and additional context.

#### @update:expanded
Triggered when the dropdown expanded state changes.

### Slots API

#### #default
Content displayed in the collapsed state of the select.

#### #search-label
Custom placeholder text for the search input when searchable is enabled.

#### #status
Custom content for displaying the selected item.

#### #item
Custom rendering for individual items in the dropdown.

```vue
<template>
    <b-select v-model="selected" :items="items">
        Placeholder
        <template #item="{ item, index }">
            <div class="flex items-center gap-xs">
                <b-icon :name="item.icon" />
                {{ item.label }}
            </div>
        </template>
    </b-select>
</template>

<script setup lang="ts">

const selected = ref(null)
const items = ref([...])
</script>
```

#### #actions
Custom action buttons for the dropdown footer.

**Important Notes:**
- Built-in search functionality for filtering large lists of options
- Keyboard navigation with arrow keys, Home, and End support
- Secondary styling variant for different visual contexts
- Automatic selection status display with customizable formatting
- Disabled state prevents interaction while maintaining visual feedback
- Absolute positioning option prevents layout shifts when dropdown opens
- Accessibility support with proper ARIA attributes and keyboard navigation