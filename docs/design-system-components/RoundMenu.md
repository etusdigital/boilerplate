# Name: RoundMenu
## Component Overview

**Purpose**: A circular radial menu component that expands menu options in a circular pattern around a central toggle button, ideal for floating action menus and contextual controls.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <RoundMenu :options="menuOptions" />
</template>

<script setup lang="ts">

const menuOptions = ref([...])
</script>
```

---

### Props API

#### options
Array of menu option objects that define the radial menu options. Type: `MenuOption[]` (required)

```typescript
type MenuOption = {
  label: string;      // Display text for the menu option
  icon: string;       // Icon name for the menu button
  background: string; // Custom background color for the button
  action: () => void; // Function to execute when option is clicked
}
```

**Dynamic Positioning**: The component automatically calculates optimal positioning based on the number of options:
- **< 7 options**: 60px radius for comfortable spacing
- **7-9 options**: Dynamic radius based on `7 * optionCount`
- **≥ 10 options**: Dynamic radius based on `6 * optionCount` for tighter spacing

---

### Events API

The component doesn't emit custom events. Interactions are handled through the `action` functions defined in each menu option.

---

### Slots API

This component uses `Button` internally and doesn't expose custom slots.

---

**Important Notes:**
- Options are positioned in a perfect circle using trigonometric calculations
- Central toggle button changes color from success (green) to neutral when expanded
- Radius automatically adjusts based on option count for optimal UX
- Each option maintains its own hover state and click interactions
- Animation performance is optimized with hardware acceleration
- Requires sufficient container space to accommodate the expanded radius