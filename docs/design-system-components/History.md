# Name: History
## Component Overview

**Purpose**: An interactive timeline component for displaying chronological events with customizable positioning, icons, and color themes for tracking progress, version control, or activity feeds.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <History 
        v-model="selectedOption"
        :options="historyOptions"
    >
        <template #option="{ option, index, active }">
            <div class="p-base">
                <p class="text-sm font-semibold mxs" :class="{ 'text-primary-default': active }">
                    {{ option.label }}
                </p>
                <p class="text-xs text-neutral-foreground-medium">
                    {{ formatDate(option.date) }}
                </p>
            </div>
        </template>
    </History>
</template>

<script setup lang="ts">

const selectedOption = ref(null)
const historyOptions = ref([...])

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    })
}
</script>
```

---

### Props API

#### v-model
Controls the selected history option from the options array. Type: `any` (default: `null`)

#### options
Array of history options to display in the timeline. Type: `any[]` (required)

```typescript
type HistoryOption = {
  label: string;           // Display name for the option
  date?: Date;            // Timestamp for the event
  type?: "primary" | "info" | "success" | "warning" | "danger" | "neutral"; // Color theme
  icon?: string;          // Icon name to display
  isIconRound?: boolean;  // Whether to use round icon styling
  unfilled?: boolean;     // Whether to use unfilled icon variant
  [key: string]: any;     // Additional custom properties
}
```

#### position
Position of the history timeline relative to content. Type: `"top" | "bottom" | "left" | "right"` (default: `"right"`)

#### type
Default color theme for history options (overridden by option.type). Type: `"primary" | "info" | "success" | "warning" | "danger" | "neutral"` (default: `"primary"`)

#### disabled
Disables option selection interaction. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a history option is selected. Receives the selected option and additional context including the index.

### Slots API

#### #option
Custom rendering for each history option in the timeline.

**Slot Props:**
- `option`: The history option object
- `index`: Position in the options array
- `active`: Whether this option is currently selected

```vue
<template>
    <History v-model="selected" :options="options">
        <template #option="{ option, index, active }">
            <div class="p-base border rounded" :class="{ 'border-primary-default': active }">
                <h4 class="font-semibold">{{ option.title }}</h4>
                <p class="text-sm text-neutral-foreground-medium">{{ option.description }}</p>
                <div class="flex items-center gap-xs mt-xs">
                    <icon :name="option.icon" />
                    <span class="text-xs">{{ formatDate(option.date) }}</span>
                </div>
            </div>
        </template>
    </History>
</template>
```

**Important Notes:**
- Automatic timeline connector lines between options for visual continuity
- Support for both regular and round icon variants with customizable styling
- Flexible positioning system (top, bottom, left, right) for different layout needs
- Individual option type override allows mixed color themes within a single timeline
- Click interaction for option selection with visual feedback
- Responsive design adapts to different screen sizes and orientations
- Icon support with filled/unfilled variants for different visual emphasis
- Active state management with automatic highlighting
- Disabled mode prevents interaction while maintaining visual presentation
- Z-index management ensures proper layering of timeline elements
- Smooth hover effects and transitions for enhanced user experience
- Accessibility support with proper keyboard navigation and ARIA attributes
- Flexible option structure allows custom properties for extended functionality