# Name: AutoComplete
## Component Overview

**Purpose**: An autocomplete input component that provides filtered suggestions as the user types, with customizable option rendering and form validation support.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <AutoComplete 
        v-model="selectedValue"
        v-model:expanded="isExpanded"
        label-value="label"
        placeholder="Placeholder"
        :options="options"
    />
</template>

<script setup lang="ts">

const selectedValue = ref('')
const isExpanded = ref(false)
const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
</script>
```

---

### Props API

#### v-model
The current input value. Type: `string` (default: `""`)

#### v-model:expanded
Controls whether the dropdown is open. Type: `boolean` (default: `false`)

#### label-value
Label displayed above the input. Type: `string` (default: `""`)

#### options
Array of string options to filter and display. Type: `number[] | string[]` (required)

#### placeholder
Placeholder text for the input field. Type: `string` (default: `""`)

#### absolute
Uses absolute positioning for the dropdown. Type: `boolean` (default: `true`)

#### required
Marks the field as required for form validation. Type: `boolean` (default: `false`)

#### disabled
Disables the input and dropdown. Type: `boolean` (default: `false`)

#### is-error
Activates error visual state. Type: `boolean` (default: `false`)

#### error-message
Error message displayed when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed below the input. Type: `string` (default: `""`)

#### max-height
Maximum height of the input area. Type: `string` (default: `"40px"`)

#### min-width
Minimum width of the component. Type: `string` (default: `"15em"`)

---

### Events API

#### @update:model-value
Triggered when the input value changes.

#### @update:expanded
Triggered when the dropdown open/close state changes.

### Slots API

#### #option
Customizes the rendering of each dropdown option. Provides `option` and `index` as slot props.

```vue
<template>
    <AutoComplete
        v-model="selectedValue"
        v-model:expanded="isExpanded"
        label-value="label"
        placeholder="Placeholder"
        :options="options"
    >
        <template #option="{ option, index }">
            <Icon name="account_circle" /> {{ option }}
        </template>
    </AutoComplete>
</template>

<script setup lang="ts">

const selectedValue = ref('')
const isExpanded = ref(false)
const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
</script>
```

**Important Notes:**
- Filtering is case-insensitive and matches partial strings
- Built on top of SelectContainer for consistent styling and behavior
- Dropdown automatically opens on focus and closes when an option is selected
- Use the `option` slot for rich content like icons, badges, or structured data
- Input value can be different from available options for flexible user input