# Name: b-date-comparator
## Component Overview

**Purpose**: A double calendar component with support for selecting multiple date ranges for comparison analysis and reporting features.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-date-comparator 
        v-model="selectedDates"
    />
</template>

<script setup lang="ts">

const selectedDates = ref([])
</script>
```

---

### Props API

#### v-model
Controls the selected date ranges for comparison. Type: `Date[] | Date[][] | null` (default: `null`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### is-compare
Enables comparison mode for selecting multiple date periods. Type: `boolean` (default: `false`)

#### max-init
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-end
Latest selectable date constraint. Type: `Date` (default: `undefined`)

---

### Events API

#### @update:model-value
Triggered when the selected date ranges change.

### Slots API

This component uses the internal Calendar component and doesn't expose custom slots.

**Important Notes:**
- Built specifically for date range comparison scenarios like analytics and reporting
- Supports both single period selection and dual period comparison via `is-compare` prop
- Returns nested arrays when in comparison mode: `[periodA[], periodB[]]`
- Each period can contain multiple dates for flexible range selection