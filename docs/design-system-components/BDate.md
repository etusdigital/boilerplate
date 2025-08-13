# Name: b-date
## Component Overview

**Purpose**: A calendar component with support for single date selection, date ranges, and localization for flexible date input handling.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-date 
        v-model="selectedDate"
    />
</template>

<script setup lang="ts">

const selectedDate = ref(null)
</script>
```

---

### Props API

#### v-model
Controls the selected date or date range. Type: `Date | Date[] | null` (default: `null`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### is-period
Enables date range selection mode. Type: `boolean` (default: `false`)

#### max-init
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-end
Latest selectable date constraint. Type: `Date` (default: `undefined`)

---

### Events API

#### @update:model-value
Triggered when the selected date or date range changes.

### Slots API

This component uses the internal Calendar component and doesn't expose custom slots.

**Important Notes:**
- Supports both single date and date range selection via `is-period` prop
- Automatically handles locale-specific date formatting and display
- Date constraints can be applied using `max-init` and `max-end` props
- Returns `Date` objects for single selection or `Date[]` arrays for ranges