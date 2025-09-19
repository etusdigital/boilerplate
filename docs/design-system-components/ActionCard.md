# Name: ActionCard
## Component Overview

**Purpose**: An interactive card component with drag-and-drop functionality, customizable header styling, and integrated delete actions for creating dynamic content management interfaces.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <ActionCard 
        icon="send"
        @delete="handleDelete"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
    >
        Label
    </ActionCard>
</template>

<script setup lang="ts">
const handleDelete = () => {}
const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}
</script>
```

---

### Props API

#### icon
Icon displayed in the card header. Type: `string` (default: `""`)

#### color
Background color for the card header. Type: `string` (default: `""`)

#### hide-drag
Hides the drag handle icon when enabled. Type: `boolean` (default: `false`)

---

### Events API

#### @dragstart
Triggered when the user starts dragging the drag handle. Receives the drag event.

#### @dragging
Triggered continuously while the user is dragging. Receives the current drag event.

#### @dragend
Triggered when the user stops dragging. Receives the final drag event.

#### @delete
Triggered when the delete icon is clicked.

### Slots API

#### #default
Content displayed as the card title in the header section.

```vue
<template>
    <ActionCard icon="settings">
        Slot: default
    </ActionCard>
</template>
```

#### #card
Main content area of the card, displayed below the header.

```vue
<template>
    <ActionCard icon="mail">
        <div class="flex justify-between items-center text-white w-full">
            <div class="flex flex-col text-sm">
                <p>Send Message:</p>
                <p class="font-bold">cartaofeito-d-fluxo-cc-dia-05-e12</p>
            </div>
            <icon class="cursor-pointer" name="visibility" />
        </div>
        <template #card>
        <div class="flex flex-col gap-sm">
            <div class="flex flex-col gap-xxs">
                <h4 class="text-neutral-foreground-high text-sm font-bold">Subject: %Email Subject%</h4>
                <p class="text-xs text-neutral-foreground-high">Links: <a class="lowercase cursor-pointer">https://cartaofeito.com/cartao-santander-sx-p1/</a></p>
            </div>
            <div class="flex gap-xs overflow-x-auto max-w-full p-xxs">
                <metric-card icon="science" title="Sample" type="dashed" color="info" value="10%" />
                <metric-card icon="drafts" title="Open" value="50%" description="100.000.000" />
                <metric-card icon="arrow_selector_tool" title="Click" value="34%" description="68.000.000" type="success" />
                <metric-card icon="touch_app" title="CTOR" value="15%" />
            </div>
            <div class="flex justify-between items-center">
                <div class="flex gap-xxs items-center text-neutral-foreground-high">
                    <icon name="mail" class="small-icon" />
                    <p class="text-sm font-bold">Total delivered: 200.000.000</p>
                </div>
                <button size="small">More statistics</button>
            </div>
        </div>
        </template>
    </ActionCard>
</template>

<style scoped>
.icon.small-icon {
    @apply text-xl;
}
</style>
```

**Important Notes:**
- Touch and mouse event support for drag operations on both desktop and mobile devices
- Automatic cursor state management (grab/grabbing) during drag interactions
- Hover effects with scale transformation and icon color changes for better user feedback
- Event cleanup on component unmount prevents memory leaks from global event listeners
- Flexible header styling with custom color support and icon integration
- Card structure built on Card component for consistent design system integration
- Delete functionality with clear visual indicator and click handling
- Responsive design adapts to different screen sizes and touch interfaces