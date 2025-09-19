# Name: Calendar
## Component Overview

**Purpose**: A calendar component with support for single date selection, date ranges, and localization for flexible date input handling.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Calendar 
        v-model="selectedDate"
    />
</template>

<script setup lang="ts">

const selectedDate = ref<Date | null>(null)
</script>
```

---

### Props API

#### v-model
Controls the selected date or date range. Type: `Date | Date[] | Date[][] | null` (default: `null`)

#### lang
Language for date formatting and localization. Type: `string` (default: `"en-US"`)

#### type
Selection mode for the calendar. Type: `"date" | "period" | "compare"` (default: `"date"`)
- `"date"`: Single date selection
- `"period"`: Date range selection  
- `"compare"`: Comparison mode with two date ranges

#### double-calendar
Shows two calendar months side by side. Type: `boolean` (default: `false`)

#### min-date
Earliest selectable date constraint. Type: `Date` (default: `undefined`)

#### max-date
Latest selectable date constraint. Type: `Date` (default: `undefined`)

---

### Events API

#### @update:model-value
Triggered when the selected date or date range changes.

### Slots API

This component uses the internal Calendar component and doesn't expose custom slots.

**Important Notes:**
- Supports single date, date range, and comparison modes via `type` prop
- Use `double-calendar` prop to show two months side by side
- Automatically handles locale-specific date formatting and display  
- Date constraints can be applied using `min-date` and `max-date` props
- Returns `Date` for single selection, `Date[]` for ranges, or `Date[][]` for comparison mode