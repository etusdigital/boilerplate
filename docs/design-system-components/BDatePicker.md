# Name: b-date-picker
## Component Overview

**Purpose**: A single date picker component with expandable interface and apply/clear actions for selecting individual dates in forms and input scenarios.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-date-picker 
        v-model="selectedDate"
        label-value="label"
    >
        Date Picker
        <template #clear-label>
            Clear
        </template>
        <template #apply-label>
            Apply
        </template>
    </b-date-picker>
</template>

<script setup lang="ts">

const selectedDate = ref(null)
</script>
```

---

### Props API

#### v-model
Controls the selected date. Type: `Date | undefined` (default: `undefined`)

#### v-model:expanded
Controls the picker dropdown open/close state. Type: `boolean` (default: `false`)

#### label-value
Label displayed above the picker component. Type: `string` (default: `""`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### max-init
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-end
Latest selectable date constraint. Type: `Date` (default: `undefined`)

#### absolute
Uses absolute positioning for the dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the picker interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required for form validation. Type: `boolean` (default: `false`)

#### is-error
Activates error visual state. Type: `boolean` (default: `false`)

#### error-message
Error message displayed when in error state. Type: `string` (default: `""`)

#### align-right
Aligns the dropdown to the right (requires absolute=true). Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selected date changes.

#### @update:expanded
Triggered when the dropdown open/close state changes.

#### @apply
Triggered when the Apply button is clicked.

### Slots API

#### #default
Content displayed in the picker trigger area when no date is selected.

#### #clear-label
Custom text for the Clear button.

#### #apply-label
Custom text for the Apply button.

#### #actions
Custom actions area to replace the default Clear/Apply buttons.

```vue
<template>
    <b-date-picker v-model="datePicker">
        Date Picker
        <template #actions>
            <b-button size="small" variant="plain" @click="handleReset">
                Cancel
            </b-button>
            <b-button size="small" @click="handleSave">
                Save Date
            </b-button>
        </template>
    </b-date-picker>
</template>

<script setup lang="ts">

const datePicker = ref(null)

const handleReset = () => {}

const handleSave = () => {}
</script>
```

**Important Notes:**
- Built on top of BDate component for consistent calendar functionality
- Supports comprehensive form validation and error handling
- Automatic date constraint validation with max-init and max-end props
- Expandable dropdown with apply/clear workflow for better UX
- Full localization support for international applications
- Customizable action buttons and text through slot system
- Optimized for form inputs and date selection scenarios