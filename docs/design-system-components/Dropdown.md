# Name: Dropdown
## Component Overview

**Purpose**: A flexible dropdown component with multi-level navigation, search functionality, and customizable trigger elements for complex menu structures.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Dropdown 
        v-model="selectedValue"
        label-value="label"
        :options="menuOptions"
    />
</template>

<script setup lang="ts">

const selectedValue = ref('')

const menuOptions = [...]
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

#### options
Array of menu options with hierarchical support. Type: `Option[]` (required)

```typescript
type Option = {
  label: string;        // Display text for menu option
  value: string;        // Unique identifier/value for selection
  icon?: string;        // Material icon name for the option
  disabled?: boolean;   // Disable interaction for this option
  bottom?: boolean;     // Position option at bottom of menu (for special options)
  options?: Option[];       // Nested sub-menu options for hierarchical structure
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
    <Dropdown 
        v-model="selectedValue"
        :options="menuOptions"
        v-model:expanded="isExpanded"
    >
        <button @click="isExpanded = !isExpanded">
            Custom Trigger
        </button>
    </Dropdown>
</template>

<script setup lang="ts">

const selectedValue = ref('')
const isExpanded = ref(false)
const menuOptions = [...]
</script>
```

**Important Notes:**
- Supports hierarchical menu structures with unlimited nesting levels
- Searchable mode transforms the component into a filterable select
- Custom trigger slot allows complete control over the dropdown appearance
- Automatic option selection state management for nested structures
- Bottom positioning option for special menu options (like logout/settings)
- Keyboard navigation support for accessibility
- Absolute positioning ensures dropdown menu doesn't affect layout