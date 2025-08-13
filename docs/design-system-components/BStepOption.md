# Name: b-step-option
## Component Overview

**Purpose**: A selectable step option component with customizable icons, titles, descriptions, and visual states for creating step-by-step workflows, wizards, and option selection interfaces.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-step-option
        title="Step Name"
        description="Lorem ipsum dolor sit amet consectetur."
        icon="email"
        @click="handleStepSelect"
    />
</template>

<script setup lang="ts">
const handleStepSelect = () => {}
</script>
```

---

### Props API

#### title
The main heading text for the step option. Type: `string` (default: `""`)

#### description
Descriptive text explaining the step or option purpose. Type: `string` (default: `""`)

#### icon
Icon name displayed alongside the step information. Type: `string` (default: `""`)

#### color
Custom color applied to the icon background and title text. Type: `string` (default: `""`)

#### disabled
Disables the step option interaction and applies disabled styling. Type: `boolean` (default: `false`)

#### is-icon-round
Changes icon display from circular background to plain icon styling. Type: `boolean` (default: `false`)

---

### Events API

#### @click
Triggered when the component is clicked (unless disabled).

---

### Slots API

This component doesn't expose custom slots. Content is controlled through props.

**Important Notes:**
- Minimum width of 400px ensures consistent layout in step sequences
- Hover effects provide clear interaction feedback for enabled states
- Disabled state preserves layout while preventing user interaction
- Color customization maintains accessibility with proper contrast
- Icon sizing automatically adjusts based on `is-icon-round` setting
- Component designed for use in stepper workflows and option selection interfaces