# Name: b-date-filter
## Component Overview

**Purpose**: A date range filter component with predefined quick options and custom date selection for filtering data by date periods in dashboards and reports.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-date-filter 
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
    </b-date-filter>
</template>

<script setup lang="ts">

const selectedDates = ref([])
</script>
```

---

### Props API

#### v-model
Controls the selected date range. Type: `Date[] | any[]` (default: `[]`)

#### label-value
Label displayed above the filter component. Type: `string` (default: `""`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### max-init
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-end
Latest selectable date constraint. Type: `Date` (default: `undefined`)

#### options
Array of predefined date range options. Type: `OptionType[]` (default: predefined options)

#### absolute
Uses absolute positioning for the dropdown. Type: `boolean` (default: `true`)

#### disabled
Disables the filter interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required for form validation. Type: `boolean` (default: `false`)

#### is-error
Activates error visual state. Type: `boolean` (default: `false`)

#### error-message
Error message displayed when in error state. Type: `string` (default: `""`)

---

### Events API

#### @update:model-value
Triggered when the selected date range changes.

#### @apply
Triggered when the Apply button is clicked.

### Slots API

#### #default
Content displayed in the filter trigger area when no date is selected.

#### #clear-label
Custom text for the Clear button.

#### #apply-label
Custom text for the Apply button.

#### #actions
Custom actions area to replace the default Clear/Apply buttons.

```vue
<template>
    <b-date-filter v-model="dateFilter">
        Date Filter
        <template #actions>
            <b-button size="small" variant="plain" @click="handleReset">
                Cancel
            </b-button>
            <b-button size="small" @click="handleSave">
                Save Filter
            </b-button>
        </template>
    </b-date-filter>
</template>

<script setup lang="ts">

const dateFilter = ref([])

const handleReset = () => {}

const handleSave = () => {}
</script>
```

**Important Notes:**
- Integrates BDate component for custom date range selection with period support
- Built-in localization support for date formatting and display
- Seamless form validation and error handling integration
- Customizable action buttons and text through slot system
- Optimized for dashboard filtering with apply/clear workflow
- Automatic date constraint validation with max-init and max-end props