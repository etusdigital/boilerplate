# Name: Textarea
## Component Overview

**Purpose**: A versatile textarea component for multi-line text input with character counting, validation, and customization options for form data collection.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Textarea 
        v-model="textareaValue"
        label-value="Message"
        placeholder="Enter your message..."
    />
</template>

<script setup lang="ts">

const textareaValue = ref('')
</script>
```

---

### Props API

#### v-model
Controls the textarea value. Type: `string` (default: `""`)

#### label-value
The label displayed above the textarea. Type: `string` (default: `""`)

#### max
Maximum character limit for textarea. Type: `number` (default: `undefined`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### disabled
Disables textarea interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### placeholder
Placeholder text for the textarea. Type: `string` (default: `""`)

#### text-align
Text alignment within textarea. Type: `'start' | 'center' | 'end'` (default: `"start"`)

#### tooltip-min-width
Minimum width for info tooltip. Type: `string` (default: `"none"`)

---

### Events API

#### @update:model-value
Triggered when the textarea value changes.

#### @focus
Triggered when the textarea gains focus. Receives the current value.

#### @blur
Triggered when the textarea loses focus. Receives the current value.

**Important Notes:**
- Multi-line text input with automatic resizing based on content
- Character limit validation with real-time counter display
- Comprehensive error handling and visual feedback
- Text alignment options (start, center, end)
- Responsive sizing options from extra small to full width
- Built-in accessibility features and keyboard navigation
- Support for required field validation
- Info tooltips for additional context