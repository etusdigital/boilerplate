# Name: b-dropdown
## Component Overview

**Purpose**: A flexible dropdown component with multi-level navigation, search functionality, and customizable trigger elements for complex menu structures.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-dropdown 
        v-model="selectedValue"
        label-value="label"
        :items="menuItems"
    />
</template>

<script setup lang="ts">

const selectedValue = ref('')

const menuItems = [...]
</script>
```

---

### Props API

#### v-model
Controls the selected value. Type: `any` (default: `undefined`)

#### v-model:expanded
Controls the dropdown expanded state. Type: `boolean` (default: `false`)

#### label-value
The label displayed for the dropdown. Type: `string` (default: `""`)

#### items
Array of menu items with hierarchical support. Type: `Item[]` (required)

```typescript
type Item = {
  label: string;        // Display text for menu item
  value: string;        // Unique identifier/value for selection
  icon?: string;        // Material icon name for the item
  disabled?: boolean;   // Disable interaction for this item
  bottom?: boolean;     // Position item at bottom of menu (for special items)
  items?: Item[];       // Nested sub-menu items for hierarchical structure
}
```

#### absolute
Controls absolute positioning of dropdown menu. Type: `boolean` (default: `true`)

#### disabled
Disables the dropdown interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### searchable
Enables search functionality within the dropdown. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Information message to display. Type: `string` (default: `""`)

#### max-height
Maximum height of the dropdown container. Type: `string` (default: `"40px"`)

#### min-width
Minimum width of the dropdown menu. Type: `string` (default: `"15em"`)

#### get-object
Returns the full object instead of just the value. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selected value changes.

#### @update:expanded
Triggered when the dropdown expanded state changes.

### Slots API

#### #default
Custom trigger element to replace the default dropdown button.

```vue
<template>
    <b-dropdown 
        v-model="selectedValue"
        :items="menuItems"
        v-model:expanded="isExpanded"
    >
        <b-button @click="isExpanded = !isExpanded">
            Custom Trigger
        </b-button>
    </b-dropdown>
</template>

<script setup lang="ts">

const selectedValue = ref('')
const isExpanded = ref(false)
const menuItems = [...]
</script>
```

**Important Notes:**
- Supports hierarchical menu structures with unlimited nesting levels
- Searchable mode transforms the component into a filterable select
- Custom trigger slot allows complete control over the dropdown appearance
- Automatic item selection state management for nested structures
- Bottom positioning option for special menu items (like logout/settings)
- Keyboard navigation support for accessibility
- Absolute positioning ensures dropdown menu doesn't affect layout