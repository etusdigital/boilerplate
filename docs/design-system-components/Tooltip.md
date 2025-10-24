# Name: Tooltip
## Component Overview

**Purpose**: A versatile tooltip component with smart positioning, automatic viewport detection, and flexible content support for providing contextual information and help text on hover interactions.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Tooltip label-value="Helpful tooltip text">
        <button>Hover me</button>
    </Tooltip>
</template>
```

---

### Props API

#### label-value
The text content displayed inside the tooltip. Type: `string` (default: `""`)

#### text (deprecated)
The text content displayed inside the tooltip. Use `label-value` instead. Type: `string` (default: `""`)

#### position
Controls the tooltip positioning relative to the trigger element. Type: `"top" | "bottom" | "left" | "right"` (default: `"right"`)

---

### Events API

This component doesn't emit custom events. Tooltip visibility is controlled internally by hover interactions.

### Slots API

#### #default
The trigger element that activates the tooltip on hover.

```vue
<template>
    <Tooltip label-value="Tooltip text">
        Slot: default
    </Tooltip>
</template>
```

#### #label
Custom content for the tooltip, overrides the `label-value` prop.

```vue
<template>
    <Tooltip>
        <button>Rich tooltip</button>
        <template #label>
            <div class="flex items-center gap-xs">
                <icon name="info" />
                <span>Rich content here</span>
            </div>
        </template>
    </Tooltip>
</template>
```

**Important Notes:**
- Smart viewport detection prevents tooltips from extending beyond screen boundaries
- Automatic text wrapping and word breaking for long content with dynamic width adjustment
- Portal rendering to body prevents z-index conflicts and ensures proper layering
- Smooth fade animations with optimized timing for better user experience
- Scroll-aware behavior automatically hides tooltips during page scrolling
- Dynamic positioning calculation accounts for trigger element size and viewport constraints
- CSS-only triangular pointers positioned accurately for all four directions
- Memory efficient event handling with automatic cleanup on component unmount