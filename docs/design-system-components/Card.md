# Name: Card
## Component Overview

**Purpose**: A simple container component that provides a card-like appearance with background, border, shadow, and rounded corners for grouping related content.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
   <Card class="w-fit">
        <div class="w-fit flex flex-col p-base gap-base">
            <h1 class="font-bold text-lg m-none">Form</h1>
            <input abel="Name" />
            <button>Save</button>
        </div>
    </Card>
</template>
```

---

### Props API

#### class
Optional CSS classes to apply additional styling to the card. Type: `string` (optional)

```vue
<template>
   <Card class="max-w-sm">...</Card>
</template>
```

---

### Events API

Card does not emit any custom events. It's a simple container component that passes through standard DOM events from the underlying div element.

---

### Slots API

#### #default
The main content slot for the card. Accepts any content that should be displayed inside the card container.

```vue
<template>
    <Card>
        Slot: default
    </Card>
</template>
```

**Important Notes:**
- The slot content determines the card's dimensions - the card adapts to its content
- Consider adding padding classes to the content for proper spacing
- The card provides the visual container, but content layout is handled by what you put in the slot
- Use semantic HTML elements within the card for better accessibility