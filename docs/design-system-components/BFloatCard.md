# Name: b-float-card
## Component Overview

**Purpose**: A floating card component with click or hover triggers, smart positioning, and intelligent scroll detection for displaying contextual content and tooltips with enhanced user experience.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-float-card v-model="isCardOpen" mode="click">
        <b-button>Click to show card</b-button>
        
        <template #card>
            <div class="p-base">
                <h4>Floating Card Content</h4>
                <p>This content appears in a floating card positioned relative to the trigger element.</p>
            </div>
        </template>
    </b-float-card>
</template>

<script setup lang="ts">

const isCardOpen = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the visibility state of the floating card. Type: `boolean` (default: `false`)

#### mode
Interaction mode for showing/hiding the card. Type: `"click" | "hover"` (default: `"click"`)

- **click**: Card appears on click and closes on outside click or scroll
- **hover**: Card appears on mouse enter and closes on mouse leave

---

### Events API

#### @update:model-value
Triggered when the card visibility state changes. Receives the new boolean value.

### Slots API

#### #default
The trigger element that activates the floating card when interacted with.

```vue
<template>
    <b-float-card v-model="showCard">
        Slot: default
    </b-float-card>
</template>
```

#### #card
Content displayed within the floating card when visible.

```vue
<template>
    <b-float-card v-model="showTooltip" mode="hover">
        Slot: default
        
        <template #card>
            <div class="p-sm max-w-xs">
                <h5 class="font-semibold mb-xs">Help Information</h5>
                <p class="text-sm">This tooltip provides additional context and guidance for the user.</p>
            </div>
        </template>
    </b-float-card>
</template>
```

**Important Notes:**
- Smart positioning automatically adjusts card placement to stay within viewport bounds
- Portal rendering (Teleport to body) ensures proper z-index layering and prevents overflow issues
- Intelligent scroll detection distinguishes between scrolling inside the card vs. outside
- Advanced event handling with both mouse and touch support for mobile compatibility
- Automatic cleanup of event listeners prevents memory leaks and performance issues
- Smooth fade animations provide polished user experience with optimized timing
- Click-outside detection works seamlessly with other page interactions
- Hover mode includes proper mouse leave detection to prevent flickering
- Card positioning considers both horizontal and vertical viewport constraints
- Responsive design maintains usability across different screen sizes and orientations