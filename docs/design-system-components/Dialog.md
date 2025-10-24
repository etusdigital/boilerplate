# Name: Dialog
## Component Overview

**Purpose**: A modal dialog component with overlay and customizable dimensions for displaying content that requires user attention or interaction.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div>
        <button @click="showDialog = true">
            Show Dialog
        </button>
        
        <Dialog v-model="showDialog">
            <div class="flex flex-col p-xl gap-sm">
                <h2 class="font-bold text-lg">Dialog</h2>
                <p class="text-sm text-neutral-foreground-low">
                    Lorem ipsum dolor sit amet consectetur. Ultricies urna mattis purus maecenas
                    amet hac viverra id feugiat. Et dui maecenas at dui. Sagittis phasellus a
                    massa praesent ultricies.
                </p>
                <div class="flex justify-end w-full gap-xs">
                    <button variant="plain" @click="showDialog = false">
                        Cancel
                    </button>
                    <button @click="showDialog = false">
                        Save
                    </button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">

const showDialog = ref(false)
</script>
```

---

### Props API

#### v-model
Controls the dialog visibility state. Type: `boolean` (default: `false`)

#### width
Sets the dialog width. Type: `string` (default: `"fit-content"`)

#### height
Sets the dialog height. Type: `string` (default: `"fit-content"`)

#### no-outside-close
Prevents closing the dialog when clicking outside. When enabled, clicking outside triggers a warning bounce animation to indicate the dialog cannot be closed. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the dialog visibility state changes.

### Slots API

#### #default
The main content area of the dialog.

```vue
<template>
    <Dialog v-model="isOpen">
        Slot: default
    </Dialog>
</template>

<script setup lang="ts">

const isOpen = ref(false)
</script>
```

**Important Notes:**
- Uses Teleport to render in document body for proper z-index stacking
- Includes smooth bounce animations for open/close transitions
- Supports click-outside-to-close behavior (can be disabled with no-outside-close)
- When no-outside-close is enabled, shows a warning bounce animation on outside clicks
- Automatically centers content and handles responsive sizing
- Built-in overlay component for consistent backdrop behavior
- Maximum dimensions constrained to viewport with padding for mobile compatibility