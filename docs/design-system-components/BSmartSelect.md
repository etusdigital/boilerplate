# Name: b-smart-select
## Component Overview

**Purpose**: An intelligent selection component that dynamically adapts between single and multi-selection modes, offering unified API and enhanced functionality for both scenarios.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-smart-select 
        v-model="selectedItem"
        label-value="label"
        :items="options"
    >
        Placeholder
    </b-smart-select>
</template>

<script setup lang="ts">

const selectedItem = ref(null)
const options = [...]
</script>
```

---

### Props API

#### v-model
Controls the selected item(s) value. Type: `any` (single) or `any[]` (multiple) (default: `null`)

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
Controls absolute positioning of the dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the select interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### searchable
Enables search functionality within the options. Type: `boolean` (default: `false`)

#### clearable
Adds clear button functionality to reset selections. Type: `boolean` (default: `false`)

#### is-multiple
Enables multi-selection mode, transforming component behavior and return types. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### get-object
Returns complete objects instead of just values when enabled. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selected item(s) change. Returns value(s) based on `is-multiple` and `get-object` settings.

#### @update:expanded
Triggered when the dropdown expanded state changes.

### Slots API

#### #default
Content displayed in the collapsed state of the select.

```vue
<template>
    <b-smart-select v-model="selected" :items="items">
        Slot: default
    </b-smart-select>
</template>

<script setup lang="ts">

const selected = ref(null)
const items = ref([...])
</script>
```

#### #search-label
Custom placeholder text for the search input when searchable is enabled.

#### #status
Custom content for displaying the selected item (single mode only).

#### #status-label
Custom text for the status display (multi-selection mode only).

#### #clear-label
Custom text for the clear button when clearable is enabled.

#### #item
Custom rendering for individual items in the dropdown.

```vue
<template>
    <b-smart-select v-model="selected" :items="items">
        Placeholder
        <template #item="{ item }">
            <div class="flex items-center gap-xs">
                <b-icon :name="item.icon" />
                {{ item.label }}
            </div>
        </template>
    </b-smart-select>
</template>

<script setup lang="ts">

const selected = ref(null)
const items = ref([...])
</script>
```

**Important Notes:**
- Dynamically switches between BSelect and BMultiSelect components based on `is-multiple` prop
- Unified API provides consistent interface regardless of selection mode
- Intelligent model parsing handles both value extraction and object return modes
- Clear functionality automatically adapts to single or multiple selection contexts
- Maintains all functionality from underlying BSelect and BMultiSelect components
- Seamless migration path from individual select components to unified solution
- Enhanced slot forwarding ensures all customization options remain available
- Optimized performance through component-level switching rather than conditional rendering