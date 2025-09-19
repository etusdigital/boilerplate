# Name: Input
## Component Overview

**Purpose**: A comprehensive input component with multiple types, validation, masking, file upload, and extensive customization options for form data collection.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Input 
        v-model="inputValue"
        label-value="label"
    />
</template>

<script setup lang="ts">

const inputValue = ref('')
</script>
```

---

### Props API

#### v-model
Controls the input value. Type: `any` (default: `undefined`)

#### label-value
The label displayed above the input. Type: `string` (default: `""`)

#### type
Input type determining behavior and validation. Type: `'text' | 'number' | 'search' | 'color' | 'password' | 'file' | 'email'` (default: `"text"`)

#### mask
Input mask for automatic formatting. Type: `'cpf' | 'cnpj' | 'cep' | 'domain' | 'url'` (default: `undefined`)

#### max
Maximum value for numbers or character limit for text. Type: `number` (default: `undefined`)

#### min
Minimum value for number inputs. Type: `number` (default: `undefined`)

#### step
Increment/decrement step for number inputs. Type: `number` (default: `1`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### disabled
Disables input interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### placeholder
Placeholder text for the input. Type: `string` (default: `""`)

#### text-align
Text alignment within input. Type: `'left' | 'center' | 'right'` (default: `"start"`)

#### tooltip-min-width
Minimum width for info tooltip. Type: `string` (default: `"none"`)

#### icon
Icon name to display in input. Type: `string` (default: `""`)

#### append-icon
Position icon at end of input. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the input value changes.

#### @focus
Triggered when the input gains focus. Receives the current value.

#### @blur
Triggered when the input loses focus. Receives the current value.

---

### Slots API

#### #icon-slot
Custom icon content for prepended (left-side) icons. This slot allows you to override the default prepend icon with custom content and behavior.

```vue
<template>
    <Input 
        v-model="inputValue" 
        label-value="Search" 
        icon="search"
        placeholder="Enter search term"
    >
        <template #icon-slot>
            <icon 
                name="search" 
                class="side-icon text-primary-interaction-default cursor-pointer hover:text-primary-foreground-low" 
                @click="performSearch" 
            />
        </template>
    </Input>
</template>

<script setup lang="ts">

const inputValue = ref('')

const performSearch = () => {}
</script>
```

#### #appended-icon-slot
Custom icon content specifically for appended (right-side) icons. This slot is independent of the `appendIcon` prop and allows full control over appended icon behavior.

```vue
<template>
    <Input 
        v-model="passwordValue" 
        type="password"
        label-value="Password" 
        placeholder="Enter your password"
    >
        <template #appended-icon-slot>
            <icon 
                :name="showPassword ? 'visibility_off' : 'visibility'" 
                class="side-icon cursor-pointer text-neutral-interaction-default hover:text-primary-foreground-low" 
                @click="togglePassword" 
            />
        </template>
    </Input>
</template>

<script setup lang="ts">

const passwordValue = ref('')
const showPassword = ref(false)

const togglePassword = () => {}
</script>
```

**Important Notes:**
- Supports multiple input types with appropriate validation and behavior
- Built-in masking for common formats (CPF, CNPJ, CEP, domain, URL)
- Automatic validation for email, domain, and URL types
- File upload with drag-and-drop support and custom preview slots
- Number inputs include increment/decrement controls and min/max validation
- Comprehensive error handling and visual feedback
- Icon support with flexible positioning (prepend or append)
- Responsive sizing options from extra small to full width
- Built-in accessibility features and keyboard navigation