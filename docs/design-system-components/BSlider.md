# Name: b-slider
## Component Overview

**Purpose**: A single-thumb slider component with customizable styling, tooltips, and support for both horizontal and vertical orientations for selecting single values within a range.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-slider v-model="selectedValue" />
</template>

<script setup lang="ts">

const selectedValue = ref(0)
</script>
```

---

### Props API

#### v-model
Controls the selected value as a single number. Type: `number` (default: `0`)

#### size
Controls the slider size variant. Type: `'small' | 'medium' | 'large'` (default: `'medium'`)

#### max
Maximum value for the slider. If specified, modelValue will be multiplied by this value. Type: `number` (default: `0`)

#### unit
Unit displayed in tooltip alongside the value. Type: `string` (default: `""`)

#### color
Custom color for the slider track and thumb. Type: `string` (default: `""`)

#### show-tooltip
Shows tooltip with current value above/beside the thumb. Type: `boolean` (default: `false`)

#### disabled
Disables slider interaction. Type: `boolean` (default: `false`)

#### vertical
Enables vertical orientation. Requires external container with specified height. Type: `boolean` (default: `false`)

#### fill-colors
Array of colors for dividing the fill area between multiple segments. Type: `any[]` (default: `[]`)

#### steps
Array of step positions (scale 0-1) where marks are placed and values snap to. Type: `any[]` (default: `[]`)

#### neutral-background
Applies neutral background styling to the slider track. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the slider value changes. Receives the new value.

---

### Slots API

This component uses the internal Slider component and doesn't expose custom slots.

**Important Notes:**
- Returns values as percentages (0-1 scale) unless `max` prop is specified
- When `max` is set, values are automatically scaled to the max value
- Vertical mode requires a parent container with explicit height
- Step mode constrains values to predefined positions for precise control
- Fill colors create visual segments across the slider track
- Tooltip positioning automatically adjusts for vertical/horizontal orientations
- Supports both keyboard and mouse/touch interactions for accessibility