# Name: b-round-button
## Component Overview

**Purpose**: A floating action button component with expandable text labels, multiple visual variants, and smooth hover animations for primary actions and quick interactions.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-round-button 
        label-value="Create"
        icon="add"
        @click="handleCreate"
    />
</template>

<script setup lang="ts">
const handleCreate = () => {}
</script>
```

---

### Props API

#### label-value
Text displayed when the button is hovered or always open. Type: `string` (default: `""`)

#### text (deprecated)
Text displayed when the button is hovered. Use `label-value` instead. Type: `string` (default: `""`)

#### type
HTML button type attribute. Type: `"button" | "reset" | "submit"` (default: `"button"`)

- **button**: Regular button for interactions
- **submit**: Submit button for forms
- **reset**: Reset button for forms

#### color
Color theme variant for the button styling. Type: `"primary" | "info" | "success" | "warning" | "danger" | "neutral"` (default: `"primary"`)

#### size
Size variant affecting button dimensions and icon size. Type: `"small" | "medium" | "large"` (default: `"small"`)

#### variant
Visual style variant affecting appearance and hover behavior. Type: `"default" | "secondary" | "plain" | "reverse"` (default: `"default"`)

- **default**: Solid filled button with colored background and white text
- **secondary**: Outlined button with transparent background and colored border
- **plain**: Minimal button with no background or border, only colored text
- **reverse**: Similar to secondary, but reverses colors on hover interaction

#### icon
Icon displayed in the button. Defaults to 'add' or theme-appropriate icon. Type: `string` (default: `""`)

#### background
Custom background color overriding the theme color. Type: `string` (default: `""`)

#### disabled
Disables the button and prevents interaction. Type: `boolean` (default: `false`)

#### always-open
When true, the text label is always visible instead of only on hover. Type: `boolean` (default: `false`)

---

### Events API

#### @click
Triggered when the button is clicked. Receives the native click event.

### Slots API

This component doesn't expose custom slots. Content is controlled via props.

**Important Notes:**
- Smooth expand/collapse animations for text labels on hover interactions
- Smart icon selection: automatically chooses appropriate icons based on color theme
- Custom background color support with automatic hover state calculations
- Responsive sizing with proportional scaling of icons and label
- Always-open mode for persistent label display in static layouts
- Accessibility support with proper button semantics and keyboard navigation
- Active scale animation provides tactile feedback on interaction
- Smooth CSS transitions for all state changes with optimized performance
- Built-in disabled state styling with interaction prevention
- Circular design perfect for floating action buttons and toolbar actions