# Name: b-filter
## Component Overview

**Purpose**: A multi-level filter component with search functionality, nested options, and customizable actions for complex data filtering scenarios.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-filter 
        v-model="selectedFilters"
        :items="filterItems"
        label-value="label"
    />
</template>

<script setup lang="ts">

const selectedFilters = ref({...})
const filterItems = ref([...])
</script>
```

---

### Props API

#### v-model
Controls the selected filter values by category. Type: `SelectedFilters` (required)

```typescript
type SelectedFilters = {
  [categoryKey: string]: any[];  // Array of selected item indices per category
}
```

#### v-model:expanded
Controls the filter dropdown expanded state. Type: `boolean` (default: `false`)

#### items
Array of filter categories with their available options. Type: `FilterItem[]` (required)

```typescript
type FilterItem = {
  [labelKey]: string | number;        // Display text for filter option
  [valueKey]: any;        // Unique value for the option
  items: any[];   // Additional custom properties
}
```

#### label-value
The label displayed for the filter button. Type: `string` (default: `""`)

#### label-key
Property name used for displaying option labels. Type: `string` (default: `"label"`)

#### value-key
Property name used for item values in the data structure. Type: `string` (default: `"value"`)

#### icon
Icon displayed on the filter button. Type: `string` (default: `"filter_list"`)

#### search-label
Placeholder text for search input when searchable is enabled. Type: `string` (default: `"Search"`)

#### searchable
Enables search functionality within filter categories. Type: `boolean` (default: `false`)

#### absolute
Controls absolute positioning of the filter dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the filter interaction. Type: `boolean` (default: `false`)

#### get-object
Returns the full object instead of just the value. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when filter selections change. Receives updated filter data and selection details.

#### @update:expanded
Triggered when the filter dropdown expanded state changes.

#### @apply
Triggered when the Apply button is clicked to confirm filter selections.

### Slots API

#### #status
Custom content for displaying filter status when items are selected.

#### #status-label
Custom text for the filter status display.

#### #clear-label
Custom text for the Clear button.

#### #apply-label
Custom text for the Apply button.

#### #actions
Custom action buttons to replace the default Clear/Apply buttons.

**Important Notes:**
- Supports hierarchical filter categories with unlimited options per category
- Built-in search functionality for finding specific filter options quickly
- Automatic selection counting and status display
- Expandable categories with smooth animations and visual feedback
- Flexible data structure allows custom properties on filter items
- Clear and Apply actions for batch filter management
- Disabled state preserves selections while preventing modifications
- Absolute positioning option prevents layout shifts when dropdown opens