# Name: b-icon-card
## Component Overview

**Purpose**: A card component with a floating icon header, customizable colors, and flexible content areas for displaying information with visual hierarchy and enhanced user experience.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-icon-card 
        title="Send Message: Message Name"
        icon="send"
    >
        <template #title-actions>
            <b-icon name="visibility" class="cursor-pointer" />
        </template>
        
        <div class="mt-sm">
            <p>Card content goes here</p>
        </div>
    </b-icon-card>
</template>
```

---

### Props API

#### title
The title text displayed in the card header. Type: `string` (default: `""`)

#### icon
Icon displayed in the floating header circle. Type: `string` (default: `""`)

#### color
Custom color for the icon background and title text. Type: `string` (default: `""`)

#### is-icon-round
Removes the circular background and increases icon size for a minimal style. Type: `boolean` (default: `false`)

---

### Events API

This component does not emit custom events.

### Slots API

#### #default
Main content area of the card, displayed below the title section.

#### #title-actions
Action elements displayed alongside the title in the header section.

**Important Notes:**
- The floating icon is positioned absolutely and extends outside the card boundaries
- When `is-icon-round` is true, the icon becomes larger and loses its background circle
- Custom colors override the default primary color scheme for both icon and title
- The card automatically adjusts its left margin to accommodate the floating icon
- Title actions slot provides flexibility for custom controls without affecting layout
- Minimum width prevents the card from becoming too narrow and maintains visual balance