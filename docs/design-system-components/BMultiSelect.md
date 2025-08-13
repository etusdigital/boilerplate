# Name: b-multi-select
## Component Overview

**Purpose**: A multi-selection component with search functionality, custom item rendering, and flexible action controls for selecting multiple options from a list. Prefer using `b-smart-select` when available with the prop `:is-multiple="true"`

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-multi-select 
        v-model="selectedItems"
        label-value="Select Options"
    >
        Placeholder
    </b-multi-select >
</template>

<script setup lang="ts">

const selectedItems = ref([
    { label: "Option 1", selected: false },
    { label: "Option 2", selected: true },
    { label: "Option 3", selected: false }
])
</script>
```

---

### Props API

#### v-model
Controls the array of selectable items with their selection state. Type: `SelectableItem[]` (required)

```typescript
type SelectableItem = {
  [labelKey]: string;     // Display text for the item
  [selectedKey]: boolean; // Selection state of the item
  disabled?: boolean;     // Disable selection for this item
  [key: string]: any;     // Additional custom properties
}
```

#### v-model:expanded
Controls the dropdown expanded state. Type: `boolean` (default: `false`)

#### label-value
The label displayed for the multi-select button. Type: `string` (default: `""`)

#### icon
Icon displayed on the multi-select button. Type: `string` (default: `""`)

#### label-key
Property name used for displaying item labels. Type: `string` (default: `"label"`)

#### selected-key
Property name used for tracking selection state. Type: `string` (default: `"selected"`)

#### absolute
Controls absolute positioning of the dropdown. Type: `boolean` (default: `true`)

#### disabled
Disables the multi-select interaction. Type: `boolean` (default: `false`)

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

#### label-formatter
Custom function for formatting item labels. Type: `(item: any) => string` (default: `undefined`)

---

### Events API

#### @update:model-value
Triggered when item selections change. Receives updated array and selection details.

#### @update:expanded
Triggered when the dropdown expanded state changes.

### Slots API

#### #default
Content displayed in the collapsed state of the multi-select.

#### #search-label
Custom placeholder text for the search input when searchable is enabled.

#### #status
Custom content for displaying selection status.

#### #status-label
Custom text for the status display.

#### #item
Custom rendering for individual items in the dropdown.

```vue
<template>
    <b-multi-select v-model="items">
        Placeholder
        <template #item="{ item, index }">
            <div class="flex items-center gap-xs">
                <b-icon :name="item.icon" />
                {{ item.label }}
            </div>
        </template>
    </b-multi-select>
</template>

<script setup lang="ts">

const items = ref([...])
</script>
```

#### #actions
Custom action buttons for the dropdown footer.

**Important Notes:**
- Built-in search functionality for filtering large lists of options
- Automatic selection counting and visual feedback
- Flexible item rendering through slots for complex layouts
- Custom action controls for batch operations
- Disabled state preserves selections while preventing modifications
- Absolute positioning option prevents layout shifts when dropdown opens
- Accessibility support with proper ARIA attributes and keyboard navigation