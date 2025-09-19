# Name: Spinner
## Component Overview

**Purpose**: A loading spinner component with customizable colors and sizes for indicating loading states.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Spinner />
</template>
```

---

### Props API

#### color
Controls the spinner's color. Can be changed through the **color** CSS property or theme colors.

```vue
<template>
    <div class="flex gap-sm">
        <Spinner class="text-neutral-interaction-default" />
        <Spinner class="text-primary-interaction-default" />
        <Spinner class="text-informative-interaction-default" />
        <Spinner class="text-success-interaction-default" />
        <Spinner class="text-warning-interaction-default" />
        <Spinner class="text-danger-interaction-default" />
    </div>
</template>
```

#### size
Controls the spinner's dimensions. Can be changed through the **font-size** CSS property, or by manipulating **width** and **height** directly.

```vue
<template>
    <div class="flex gap-sm">
        <Spinner class="text-xs" />
        <Spinner class="text-xl" />
        <Spinner class="text-3xl" />
        <Spinner class="text-5xl" />
        <Spinner class="text-7xl" />
      </div>
</template>
```

**Important Notes:**
- Use appropriate sizes for different contexts (small for inline, larger for overlays)
- Consider accessibility by providing loading text or aria-labels
- The spinner inherits color from its parent element unless explicitly styled