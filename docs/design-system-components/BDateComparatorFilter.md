# Name: b-date-comparator-filter
## Component Overview

**Purpose**: A comprehensive date filter component with predefined options, custom date selection, and comparison mode for advanced filtering in dashboards and reports.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-date-comparator-filter 
        v-model="selectedDates"
        label-value="label"
    >
        Date Filter
        <template #clear-label>
            Clear
        </template>
        <template #apply-label>
            Apply
        </template>
        <template #compare-label>
            Compare two periods
        </template>
    </b-date-comparator-filter>
</template>

<script setup lang="ts">

const selectedDates = ref(null)
</script>
```

---

### Props API

#### v-model
Controls the selected date or date ranges. Type: `Date[] | Date[][] | null` (default: `null`)

#### v-model:expanded
Controls the filter dropdown open/close state. Type: `boolean` (default: `false`)

#### label-value
Label displayed above the filter component. Type: `string` (default: `""`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### is-compare
Enables comparison mode for selecting two periods. Type: `boolean` (default: `false`)

#### max-init
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-end
Latest selectable date constraint. Type: `Date` (default: `undefined`)

#### options
Array of predefined date range options. Type: `OptionType[]` (default: predefined options)

#### absolute
Uses absolute positioning for the dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the filter interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required for form validation. Type: `boolean` (default: `false`)

#### is-error
Activates error visual state. Type: `boolean` (default: `false`)

#### error-message
Error message displayed when in error state. Type: `string` (default: `""`)

#### align-right
Aligns the dropdown to the right (requires absolute=true). Type: `boolean` (default: `false`)

#### separator
Custom separator text for comparison mode. Type: `string` (default: auto-detected based on language)

---

### Events API

#### @update:model-value
Triggered when the selected date or date ranges change.

#### @update:expanded
Triggered when the dropdown open/close state changes.

#### @update:is-compare
Triggered when comparison mode is toggled.

#### @apply
Triggered when the Apply button is clicked.

### Slots API

#### #default
Content displayed in the filter trigger area when no date is selected.

#### #compare-label
Custom text for the comparison mode checkbox.

#### #clear-label
Custom text for the Clear button.

#### #apply-label
Custom text for the Apply button.

#### #actions
Custom actions area to replace the default Clear/Apply buttons.

```vue
<template>
    <b-date-comparator-filter v-model="dateFilter">
        Date Filter
        <template #actions>
            <b-button size="small" variant="plain" @click="handleReset">
                Cancel
            </b-button>
            <b-button size="small" @click="handleSave">
                Save Filter
            </b-button>
        </template>
    </b-date-comparator-filter>
</template>

<script setup lang="ts">

const dateFilter = ref(null)

const handleReset = () => {}

const handleSave = () => {}
</script>
```

**Important Notes:**
- Combines predefined quick options with custom date selection for maximum flexibility
- Supports both single period and comparison mode with visual distinction
- Built-in localization support with automatic separator detection
- Integrates seamlessly with form validation and error handling
- Customizable action buttons and text through comprehensive slot system
- Optimized for dashboard and analytics use cases with apply/clear workflow