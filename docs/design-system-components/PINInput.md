# Name: PIN Input

## Component Overview

**Purpose**: A specialized input component that allows users to enter a sequence of one-character alphanumeric inputs, commonly used for verification codes, PINs, and OTP entries.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <PINInput 
        v-model="pinValue"
        :length="6"
        @complete="handleComplete"
    />
</template>

<script setup lang="ts">

const pinValue = ref('')

const handleComplete = (value: string) => {
    console.log('PIN entered:', value)
}
</script>
```

---

### Props API

#### v-model
Controls the PIN input value as a string. Type: `string` (default: `""`)

#### length
Number of input fields to display. Type: `number` (default: `6`)

#### disabled
Disables all PIN input fields. Type: `boolean` (default: `false`)

#### placeholder
Placeholder text for each input field. Type: `string` (default: `""`)

#### separator
Character or string to display between input fields. Type: `string` (default: `""`)

#### type
Input field type - use 'password' to mask the entered values. Type: `'text' | 'password'` (default: `"text"`)

#### mask
Whether to mask the input values (alternative to password type). Type: `boolean` (default: `false`)

#### otp
Indicates this is an OTP input for accessibility and autocomplete. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the PIN value changes. Receives the complete string value.

```vue
<PINInput 
    v-model="pinValue"
    @update:model-value="handleValueChange"
/>
```

#### @complete
Triggered when all PIN fields are filled. Receives the complete string value.

```vue
<PINInput 
    :length="6"
    @complete="handleComplete"
/>
```

---

### Methods API

The component exposes the following methods via template refs:

#### focus()
Focuses the first empty input field, or the first field if all are filled.

```vue
<template>
    <PINInput ref="pinInputRef" v-model="pinValue" />
    <button @click="focusPinInput">Focus PIN Input</button>
</template>

<script setup lang="ts">

const pinInputRef = ref()
const pinValue = ref('')

const focusPinInput = () => {
    pinInputRef.value?.focus()
}
</script>
```

#### clear()
Clears all input fields and focuses the first field.

```vue
<template>
    <PINInput ref="pinInputRef" v-model="pinValue" />
    <button @click="clearPinInput">Clear PIN</button>
</template>

<script setup lang="ts">

const pinInputRef = ref()
const pinValue = ref('')

const clearPinInput = () => {
    pinInputRef.value?.clear()
}
</script>
```

---

### Accessibility Features

- **Keyboard Navigation**: Arrow keys navigate between fields
- **Paste Support**: Ctrl/Cmd+V distributes pasted content across fields  
- **Auto Focus**: Automatically focuses next field on input
- **Backspace Handling**: Smart backspace navigation between fields
- **Field Selection**: Selects field content on focus
- **Screen Reader Support**: Proper labeling and OTP indication

---

### Styling & Theming

The PIN Input component uses design system tokens and supports:

- **Focus States**: Visual feedback when fields are focused
- **Filled States**: Different styling for completed fields  
- **Disabled States**: Proper disabled appearance and behavior
- **Error States**: Can be combined with form validation
- **Responsive Sizing**: Adapts to different screen sizes

**Important Notes:**
- Each input field accepts only one character
- Supports both text and password input types
- Automatic navigation between fields on input/backspace
- Paste functionality distributes content across all fields
- Complete keyboard accessibility with arrow key navigation
- Optimized for mobile and desktop usage
- Built-in support for verification codes and OTP workflows