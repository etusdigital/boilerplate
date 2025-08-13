# Name: b-tag-input
## Component Overview

**Purpose**: An interactive input component for creating and managing multiple tags with validation, duplicate prevention, masking support, and flexible constraints for collecting structured data entries.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-tag-input 
        v-model="tags"
        label-value="label"
    >
        <template #hint-message>
            Press enter to add a new tag
        </template>
    </b-tag-input>
</template>

<script setup lang="ts">

const tags = ref([])
</script>
```

---

### Props API

#### v-model
Controls the array of tag values. Type: `any[]` (required)

#### label-value
The label displayed above the input field. Type: `string` (default: `""`)

#### placeholder
Placeholder text shown in the input area. Type: `string` (default: `""`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### disabled
Disables the input interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### allow-duplicate
Allows duplicate tag values when enabled. Type: `boolean` (default: `false`)

#### max
Maximum number of tags allowed. Type: `number` (default: `undefined`)

#### mask
Input validation mask for specific data formats. Type: `"cpf" | "cnpj" | "cep" | "domain" | "url" | "email"` (default: `undefined`)

---

### Events API

#### @update:model-value
Triggered when the tag array changes (addition or removal). Receives the updated array.

### Slots API

#### #hint-message
Custom informational text displayed below the input area.

```vue
<template>
    <b-tag-input v-model="tags" label-value="label">
        <template #hint-message>
            Press enter to add a new tag
        </template>
    </b-tag-input>
</template>

<script setup lang="ts">

const tags = ref([])
</script>
```

**Important Notes:**
- Support for multiple input methods: Enter key, Tab key, comma separation, and line breaks
- Built-in validation for email, domain, URL, CPF, CNPJ, and CEP formats when using masks
- Automatic duplicate detection and prevention (configurable via allow-duplicate)
- Visual feedback with error animations and color-coded states
- Tag tooltips show full content for long values with text wrapping
- Maximum tag limit with visual counter display
- Backspace key removes last tag when input is empty
- Real-time error messaging with auto-dismiss functionality
- Accessible keyboard navigation and focus management
- Responsive design adapts to container width with tag wrapping