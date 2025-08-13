# Name: b-group
## Component Overview

**Purpose**: A container component for grouping related input components with synchronized selection state, commonly used for radio button groups and visual component grouping.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-group v-model="selectedValue">
        <b-radio group-value="1">First Option</b-radio>
        <b-radio group-value="2">Second Option</b-radio>
        <b-radio group-value="3">Third Option</b-radio>
    </b-group>
    
    <p>Selected: {{ selectedValue }}</p>
</template>

<script setup lang="ts">

const selectedValue = ref('option1')
</script>
```

---

### Props API

#### v-model
Controls the currently selected component's group-value. Type: `any` (default: `null`)

#### vertical
Arranges grouped components vertically instead of horizontally. Type: `boolean` (default: `false`)

#### disabled
Disables all grouped components. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the selection changes within the group.

### Slots API

#### #default
Contains the grouped components. Each component should have a `group-value` prop for selection tracking.

```vue
<template>
    <b-group v-model="selected">
        <b-radio group-value="value1">Label 1</b-radio>
        <b-radio group-value="value2">Label 2</b-radio>
    </b-group>
</template>
```

---

### Component Behavior Inside BGroup

The BGroup component handles different child components in specific ways, applying appropriate styling and behavior based on the component type.

#### BRadio Components
Radio buttons maintain individual spacing and selection states.

**Behavior**: Individual spacing with margins between items

```vue
<template>
    <b-group v-model="radioValue">
        <b-radio group-value="1">First</b-radio>
        <b-radio group-value="2">Second</b-radio>
        <b-radio group-value="3">Third</b-radio>
    </b-group>
</template>

<script setup lang="ts">

const radioValue = ref('1')
</script>
```

#### BRadioButton Components
Radio buttons are styled as connected button groups with shared borders.

**Behavior**: Connected borders, rounded corners only on first/last items

```vue
<template>
    <b-group v-model="buttonValue">
        <b-radio-button group-value="1">First</b-radio-button>
        <b-radio-button group-value="2">Second</b-radio-button>
        <b-radio-button group-value="3">Third</b-radio-button>
    </b-group>
</template>

<script setup lang="ts">

const buttonValue = ref(null)
</script>
```

#### Custom Radio Divs
Radio buttons can be styled as custom divs using the `is-div` prop for visual variety.

**Behavior**: Custom visual elements with small spacing

```vue
<template>
    <b-group v-model="divValue">
        <b-radio-button group-value="1" is-div>
            <div class="border-2 h-5 w-5" />
        </b-radio-button>
        <b-radio-button group-value="2" is-div>
            <div class="border-2 h-5 w-5 rounded" />
        </b-radio-button>
        <b-radio-button group-value="3" is-div>
            <div class="border-2 h-5 w-5 rounded-full" />
        </b-radio-button>
    </b-group>
</template>

<script setup lang="ts">

const divValue = ref(null)
</script>
```

#### Visual Connectors
Non-radio components are connected with visual lines to show relationships.

**Behavior**: Visual connectors with lines showing flow relationships

```vue
<template>
    <b-group v-model="connectorValue" vertical class="items-center">
        <b-card class="p-4">
            <b-input label="Name" placeholder="Type here" />
        </b-card>
        <b-round-button variant="positive" />
    </b-group>
</template>

<script setup lang="ts">

const connectorValue = ref(null)
</script>
```

**Important Notes:**
- Model value synchronization works bidirectionally between BGroup and child components
- Each grouped component needs a unique `group-value` prop for proper selection tracking
- Visual connectors appear automatically for non-radio components
- Use `vertical` prop to change layout orientation for all grouped components