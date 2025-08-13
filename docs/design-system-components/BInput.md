# Name: b-input
## Component Overview

**Purpose**: A comprehensive input component with multiple types, validation, masking, file upload, and extensive customization options for form data collection.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-input 
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

#### size
Input component width. Type: `'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'full'` (default: `"full"`)

#### is-text-area
Renders as textarea instead of input. Type: `boolean` (default: `false`)

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

#### #uploaded-file
Custom content for file upload display when a file is selected.

```vue
<template>
    <b-input type="file" label-value="Upload Document">
        <template #uploaded-file>
            <div class="flex items-center gap-xs">
                <b-icon name="description" class="text-primary-500" />
                <span class="text-sm">Custom file display</span>
                <b-button size="small" variant="plain" @click="removeFile">
                    Remove
                </b-button>
            </div>
        </template>
    </b-input>
</template>

<script setup lang="ts">
const removeFile = () => {}
</script>
```

**Important Notes:**
- Supports multiple input types with appropriate validation and behavior
- Built-in masking for common formats (CPF, CNPJ, CEP, domain, URL)
- Automatic validation for email, domain, and URL types
- File upload with drag-and-drop support and custom preview slots
- Number inputs include increment/decrement controls and min/max validation
- Textarea mode for multi-line text input with character counting
- Comprehensive error handling and visual feedback
- Icon support with flexible positioning (prepend or append)
- Responsive sizing options from extra small to full width
- Built-in accessibility features and keyboard navigation