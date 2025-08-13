# Name: b-spinner
## Component Overview

**Purpose**: A loading spinner component with customizable colors and sizes for indicating loading states.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-spinner />
</template>
```

---

### Props API

#### color
Controls the spinner's color. Can be changed through the **color** CSS property or theme colors.

```vue
<template>
    <div class="flex gap-sm">
        <b-spinner class="text-neutral-interaction-default" />
        <b-spinner class="text-primary-interaction-default" />
        <b-spinner class="text-informative-interaction-default" />
        <b-spinner class="text-success-interaction-default" />
        <b-spinner class="text-warning-interaction-default" />
        <b-spinner class="text-danger-interaction-default" />
    </div>
</template>
```

#### size
Controls the spinner's dimensions. Can be changed through the **font-size** CSS property, or by manipulating **width** and **height** directly.

```vue
<template>
    <div class="flex gap-sm">
        <b-spinner class="text-xs" />
        <b-spinner class="text-xl" />
        <b-spinner class="text-3xl" />
        <b-spinner class="text-5xl" />
        <b-spinner class="text-7xl" />
      </div>
</template>
```

**Important Notes:**
- Use appropriate sizes for different contexts (small for inline, larger for overlays)
- Consider accessibility by providing loading text or aria-labels
- The spinner inherits color from its parent element unless explicitly styled