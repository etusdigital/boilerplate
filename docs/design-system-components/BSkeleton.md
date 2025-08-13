# Name: b-skeleton
## Component Overview

**Purpose**: A loading placeholder component with animated shimmer effect that mimics content structure while data is being fetched, providing visual feedback during loading states.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-skeleton class="h-xs w-full" />
</template>
```

---

### Props API

This component doesn't accept any props. Styling is controlled through CSS classes applied to the component.

---

### Events API

This component doesn't emit any events.

---

### Slots API

This component doesn't expose any slots.

---

**Important Notes:**
- Uses CSS animation with a moving gradient effect for realistic loading appearance
- Default minimum dimensions prevent layout collapse during loading
- Fully customizable through Tailwind CSS classes for width, height, and border radius
- Animation runs continuously at 1.5s intervals with smooth linear timing
- Background uses neutral surface colors that adapt to theme variations
- No JavaScript required - pure CSS animation for optimal performance
- Combine multiple skeletons to create complex loading layouts that match your content structure