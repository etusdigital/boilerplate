# Name: Drawer
## Component Overview

**Purpose**: A slide-out drawer panel component that can appear from any side of the screen (right, left, top, bottom) with an overlay backdrop, supporting customizable width/height and close behavior.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div>
        <button @click="openDrawer">Show Drawer</button>
        <Drawer v-model="showDrawer" size="40%" position="right">
            <div class="flex flex-col justify-between h-full p-xl">
                <div class="flex flex-col gap-sm">
                    <h2 class="font-bold text-lg">Drawer</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur. Ultricies urna mattis purus
                        maecenas amet hac viverra id feugiat. Et dui maecenas at dui. Sagittis
                        phasellus a massa praesent ultricies.
                    </p>
                </div>
                <div class="flex justify-end w-full gap-xs">
                    <button variant="plain" @click="showDrawer = false">Cancel</button>
                    <button>Save</button>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script setup lang="ts">

const showDrawer = ref(false)

const openDrawer = () => {
    showDrawer.value = true
}
</script>
```

---

### Props API

#### v-model
Controls the visibility of the drawer (v-model support). Type: `boolean` (default: `false`)

#### size
Sets the size of the drawer panel. For left/right positions this controls width, for top/bottom positions this controls height. Type: `string` (default: `"fit-content"`)

#### no-outside-close
Prevents the drawer from closing when clicking on the overlay. Type: `boolean` (default: `false`)

#### position
Sets the position from which the drawer will slide. Type: `"right" | "left" | "top" | "bottom"` (default: `"right"`)

---

### Events API

#### update:model-value
Emitted when the drawer's visibility state changes (v-model support). Receives the new boolean value.

---

### Slots API

#### #default
The main content slot for the drawer. Contains all the drawer content including headers, body, and actions.

```vue
<template>
    <Drawer v-model="showForm" size="500px" position="right">
        Slot: default
    </Drawer>
</template>

<script setup lang="ts">

const showForm = ref(false)
</script>
```

**Important Notes:**
- The drawer uses `Teleport` to render in the document body for proper z-index layering
- On mobile devices (< 768px), the drawer always slides from bottom regardless of position prop
- The drawer automatically handles focus management and accessibility
- Different positions use appropriate animations: right/left slide horizontally, top/bottom slide vertically
- For top/bottom positions, the `size` prop controls the height instead of width
- Content should include proper padding and structure for best visual results
- Consider using semantic HTML elements (nav, header, main, etc.) within the slot for accessibility