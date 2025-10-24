# Name: TagInput
## Component Overview

**Purpose**: An interactive input component for creating and managing multiple tags with validation, duplicate prevention, masking support, and flexible constraints for collecting structured data entries.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <TagInput 
        v-model="tags"
        label-value="label"
    >
        <template #hint-message>
            Press enter to add a new tag
        </template>
    </TagInput>
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

#### icon
Icon name to display in input. Type: `string` (default: `""`)

#### append-icon
Position icon at end of input. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the tag array changes (addition or removal). Receives the updated array.

### Slots API

#### #hint-message
Custom informational text displayed below the input area.

```vue
<template>
    <TagInput v-model="tags" label-value="label">
        <template #hint-message>
            Press enter to add a new tag
        </template>
    </TagInput>
</template>

<script setup lang="ts">

const tags = ref([])
</script>
```

#### #icon-slot
Custom icon content for prepended (left-side) icons. This slot allows you to override the default prepend icon with custom content and behavior.

```vue
<template>
    <TagInput 
        v-model="inputValue" 
        label-value="label" 
    >
        <template #icon-slot>
            <icon 
                name="plus" 
                class="side-icon cursor-pointer text-neutral-interaction-default hover:text-primary-foreground-low" 
                @click="handleCreate" 
            />
        </template>
    </TagInput >
</template>

<script setup lang="ts">

const inputValue = ref('')

const handleCreate = () => {}
</script>
```

#### #appended-icon-slot
Custom icon content specifically for appended (right-side) icons. This slot is independent of the `appendIcon` prop and allows full control over appended icon behavior.

```vue
<template>
    <TagInput
        v-model="inputValue" 
        label-value="label" 
    >
        <template #appended-icon-slot>
            <icon 
                name="plus" 
                class="side-icon cursor-pointer text-neutral-interaction-default hover:text-primary-foreground-low" 
                @click="handleCreate" 
            />
        </template>
    </TagInput >
</template>

<script setup lang="ts">

const inputValue = ref('')

const handleCreate = () => {}
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