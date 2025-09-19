# Name: TagSelect
## Component Overview

**Purpose**: A tag-based selection component with search functionality, custom tag creation, and removable tag management for collecting multiple values as visual tags.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <TagSelect 
        v-model="selectedTags"
        label-value="Select Tags"
        :options="availableTags"
    >
        <template #search-label>
            Search
        </template>
        <template #no-options-found>
            No result found
        </template>
        <template #empty-state>
            No tags created yet
        </template>
    </TagSelect>
</template>

<script setup lang="ts">

const selectedTags = ref([...])
const availableTags = ref([...])
</script>
```

---

### Props API

#### v-model
Controls the selected tags array. Type: `any[]` (default: `[]`)

#### v-model:expanded
Controls the dropdown expanded state. Type: `boolean` (default: `false`)

#### label-value
The label displayed for the tag select input. Type: `string` (default: `""`)

#### options
Array of available tag options. Can be strings or objects. Type: `any[]` (default: `[]`)

#### icon
Icon displayed on the tag select input. Type: `string` (default: `""`)

#### label-key
Property name used for displaying option labels when using object arrays. Type: `string` (default: `"label"`)

#### absolute
Controls absolute positioning of the dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the tag select interaction. Type: `boolean` (default: `false`)

#### required
Marks the field as required. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### button-label
Text displayed on the add button. Type: `string` (default: `"Add"`)

---

### Events API

#### @update:model-value
Triggered when the selected tags change. Receives the updated tags array.

#### @update:options
Triggered when new tags are added to the options array. Receives the updated options array.

#### @update:expanded
Triggered when the dropdown expanded state changes.

---

### Slots API

#### #search-label
Custom placeholder text for the search input.

#### #no-options-found
Custom content displayed when search yields no results.

#### #empty-state
Custom content displayed when no options are available.

#### #option
Custom rendering for individual options in the dropdown.

**Important Notes:**
- Prevents duplicate tag selection automatically
- Supports both string arrays and object arrays with configurable label keys
- New tags created via search are automatically added to the options array
- Search input is accessible and maintains focus for continuous tag creation
- Visual feedback distinguishes between available and selected options
- Disabled state prevents tag creation while maintaining visual feedback
- Absolute positioning option prevents layout shifts when dropdown opens