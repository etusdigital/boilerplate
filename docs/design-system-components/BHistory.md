# Name: b-history
## Component Overview

**Purpose**: An interactive timeline component for displaying chronological events with customizable positioning, icons, and color themes for tracking progress, version control, or activity feeds.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-history 
        v-model="selectedItem"
        :items="historyItems"
    >
        <template #item="{ item, index, active }">
            <div class="p-base">
                <p class="text-sm font-semibold mb-xs" :class="{ 'text-primary-default': active }">
                    {{ item.label }}
                </p>
                <p class="text-xs text-neutral-foreground-medium">
                    {{ formatDate(item.date) }}
                </p>
            </div>
        </template>
    </b-history>
</template>

<script setup lang="ts">

const selectedItem = ref(null)
const historyItems = ref([...])

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
Controls the selected history item from the items array. Type: `any` (default: `null`)

#### items
Array of history items to display in the timeline. Type: `any[]` (required)

```typescript
type HistoryItem = {
  label: string;           // Display name for the item
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
Default color theme for history items (overridden by item.type). Type: `"primary" | "info" | "success" | "warning" | "danger" | "neutral"` (default: `"primary"`)

#### disabled
Disables item selection interaction. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a history item is selected. Receives the selected item and additional context including the index.

### Slots API

#### #item
Custom rendering for each history item in the timeline.

**Slot Props:**
- `item`: The history item object
- `index`: Position in the items array
- `active`: Whether this item is currently selected

```vue
<template>
    <b-history v-model="selected" :items="items">
        <template #item="{ item, index, active }">
            <div class="p-base border rounded" :class="{ 'border-primary-default': active }">
                <h4 class="font-semibold">{{ item.title }}</h4>
                <p class="text-sm text-neutral-foreground-medium">{{ item.description }}</p>
                <div class="flex items-center gap-xs mt-xs">
                    <b-icon :name="item.icon" />
                    <span class="text-xs">{{ formatDate(item.date) }}</span>
                </div>
            </div>
        </template>
    </b-history>
</template>
```

**Important Notes:**
- Automatic timeline connector lines between items for visual continuity
- Support for both regular and round icon variants with customizable styling
- Flexible positioning system (top, bottom, left, right) for different layout needs
- Individual item type override allows mixed color themes within a single timeline
- Click interaction for item selection with visual feedback
- Responsive design adapts to different screen sizes and orientations
- Icon support with filled/unfilled variants for different visual emphasis
- Active state management with automatic highlighting
- Disabled mode prevents interaction while maintaining visual presentation
- Z-index management ensures proper layering of timeline elements
- Smooth hover effects and transitions for enhanced user experience
- Accessibility support with proper keyboard navigation and ARIA attributes
- Flexible item structure allows custom properties for extended functionality