# Name: b-round-menu
## Component Overview

**Purpose**: A circular radial menu component that expands menu items in a circular pattern around a central toggle button, ideal for floating action menus and contextual controls.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-round-menu :items="menuItems" />
</template>

<script setup lang="ts">

const menuItems = ref([...])
</script>
```

---

### Props API

#### items
Array of menu item objects that define the radial menu options. Type: `MenuItem[]` (required)

```typescript
type MenuItem = {
  label: string;      // Display text for the menu item
  icon: string;       // Icon name for the menu button
  background: string; // Custom background color for the button
  action: () => void; // Function to execute when item is clicked
}
```

**Dynamic Positioning**: The component automatically calculates optimal positioning based on the number of items:
- **< 7 items**: 60px radius for comfortable spacing
- **7-9 items**: Dynamic radius based on `7 * itemCount`
- **≥ 10 items**: Dynamic radius based on `6 * itemCount` for tighter spacing

---

### Events API

The component doesn't emit custom events. Interactions are handled through the `action` functions defined in each menu item.

---

### Slots API

This component uses `BRoundButton` internally and doesn't expose custom slots.

---

**Important Notes:**
- Items are positioned in a perfect circle using trigonometric calculations
- Central toggle button changes color from success (green) to neutral when expanded
- Radius automatically adjusts based on item count for optimal UX
- Each item maintains its own hover state and click interactions
- Animation performance is optimized with hardware acceleration
- Requires sufficient container space to accommodate the expanded radius