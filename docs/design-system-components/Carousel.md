# Name: Carousel
## Component Overview

**Purpose**: A carousel component that displays a collection of options with navigation controls and pagination indicators.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Carousel 
        v-model="currentIndex"
        :options="options"
        :visible="3"
        :vertical="false"
        :disabled="false"
        :circular="false"
    >
        <template #option="{ option, index }">
            <Card class="p-base">
                {{ option.label }}
            </Card>
        </template>
    </Carousel>
</template>
```

---

### Props API

#### v-model
Current active index of the carousel. Type: `number` (default: `0`)

#### options
Array of options to display in the carousel. Type: `any[]` (required)

#### visible
Number of options visible at once. Type: `number` (default: `1`)

#### interval
Auto-play interval in milliseconds. Type: `number` (default: `3000`)

#### disabled
Disables navigation controls. Type: `boolean` (default: `false`)

#### circular
Enables circular navigation. Type: `boolean` (default: `false`)

#### vertical
Arranges carousel vertically. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Emitted when the active index changes. Payload: `number`

---

### Slots API

#### #option
Slot for rendering individual carousel options.

```vue
<template>
    <Carousel :options="options">
        <template #option="{ option, index }">
            <div>{{ option.label }}</div>
        </template>
    </Carousel>
</template>
```

**Important Notes:**
- Use the `#option` slot to customize how each option is rendered
- Navigation arrows automatically adjust for vertical/horizontal orientation
- Pagination indicators show current position
- Supports both manual and automatic navigation