# Name: b-sidebar
## Component Overview

**Purpose**: A slide-out sidebar panel component that appears from the right side of the screen with an overlay backdrop, supporting customizable width and close behavior.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div>
        <b-button @click="openSidebar">Show Sidebar</b-button>
        <b-sidebar v-model="showSidebar" width="40%">
            <div class="flex flex-col justify-between h-full p-xl">
                <div class="flex flex-col gap-sm">
                    <h2 class="font-bold text-lg">Sidebar</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur. Ultricies urna mattis purus
                        maecenas amet hac viverra id feugiat. Et dui maecenas at dui. Sagittis
                        phasellus a massa praesent ultricies.
                    </p>
                </div>
                <div class="flex justify-end w-full gap-xs">
                    <b-button variant="plain" @click="showSidebar = false">Cancel</b-button>
                    <b-button>Save</b-button>
                </div>
            </div>
        </b-sidebar>
    </div>
</template>

<script setup lang="ts">

const showSidebar = ref(false)

const openSidebar = () => {
    showSidebar.value = true
}
</script>
```

---

### Props API

#### v-model
Controls the visibility of the sidebar (v-model support). Type: `boolean` (default: `false`)

#### width
Sets the width of the sidebar panel. Type: `string` (default: `"fit-content"`)

#### no-outside-close
Prevents the sidebar from closing when clicking on the overlay. Type: `boolean` (default: `false`)

---

### Events API

#### update:model-value
Emitted when the sidebar's visibility state changes (v-model support). Receives the new boolean value.

---

### Slots API

#### #default
The main content slot for the sidebar. Contains all the sidebar content including headers, body, and actions.

```vue
<template>
    <b-sidebar v-model="showForm" width="500px">
        Slot: default
    </b-sidebar>
</template>

<script setup lang="ts">

const showForm = ref(false)
</script>
```

**Important Notes:**
- The sidebar uses `Teleport` to render in the document body for proper z-index layering
- On mobile devices (< 768px), the sidebar slides from bottom instead of right
- The sidebar automatically handles focus management and accessibility
- Content should include proper padding and structure for best visual results
- Consider using semantic HTML elements (nav, header, main, etc.) within the slot for accessibility