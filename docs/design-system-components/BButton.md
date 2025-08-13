# Name: b-button
## Component Overview

**Purpose**: A customizable button component with support for different colors, sizes, variants, loading states, and progress indicators.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-button>Label</b-button>
</template>
```

---

### Props API

#### type
Controls the HTML button type attribute. Options: `"button"` | `"submit"` | `"reset"` (default: `"button"`)

- **button**: Regular button for interactions
- **submit**: Submit button for forms
- **reset**: Reset button for forms

```vue
<template>
    <b-button type="button" @click="handleClick">Click me</b-button>
    <b-button type="submit">Submit Form</b-button>
    <b-button type="reset">Reset Form</b-button>
</template>
```

#### color
Sets the button's color theme. Options: `"primary"` | `"info"` | `"success"` | `"warning"` | `"danger"` | `"neutral"` (default: `"primary"`)

```vue
<template>
    <div class="flex gap-xs">
        <b-button color="primary">Primary</b-button>
        <b-button color="info">Info</b-button>
        <b-button color="success">Success</b-button>
        <b-button color="warning">Warning</b-button>
        <b-button color="danger">Danger</b-button>
        <b-button color="neutral">Neutral</b-button>
    </div>
</template>
```

#### size
Controls the button's dimensions and padding. Options: `"small"` | `"medium"` | `"large"` (default: `"medium"`)

```vue
<template>
    <div class="flex gap-xs">
        <b-button class="h-fit" size="small">Small</b-button>
        <b-button class="h-fit" size="medium">Medium</b-button>
        <b-button class="h-fit" size="large">Large</b-button>
    </div>
</template>
```

#### variant
Changes the button's visual style. Options: `"default"` | `"secondary"` | `"plain"` | `"reverse"` (default: `"default"`)

- **default**: Solid filled button with colored background and white text
- **secondary**: Outlined button with transparent background and colored border
- **plain**: Minimal button with no background or border, only colored text
- **reverse**: Similar to secondary, but reverses colors on hover interaction

```vue
<template>
    <div class="flex gap-xs">
        <b-button variant="default">Default</b-button>
        <b-button variant="secondary">Secondary</b-button>
        <b-button variant="plain">Plain</b-button>
        <b-button variant="reverse">Reverse</b-button>
    </div>
</template>
```

#### disabled
Disables the button and prevents interactions. Type: `boolean` (default: `false`)

```vue
<template>
    <b-button disabled>Disabled</b-button>
</template>
```

#### loading
Shows a spinner and disables interactions. Type: `boolean` (default: `false`)

```vue
<template>
    <b-button loading>Loading...</b-button>
</template>
```

#### progress
Shows a progress bar overlay (0-1 range). When > 0, automatically enables loading state. Type: `number` (default: `0`)

```vue
<template>
    <div class="flex gap-xs">
        <b-button :progress="0.3">30% Complete</b-button>
        <b-button :progress="0.75">75% Complete</b-button>
        <b-button :progress="1">Complete!</b-button>
    </div>
</template>
```

#### id & name
HTML attributes for form handling and accessibility. Type: `string` (optional)

```vue
<template>
    <form>
        <!-- When id/name is provided, creates a label element for better accessibility -->
        <b-button id="submit-btn" name="submit-button" type="submit">
            Submit Form
        </b-button>
    </form>
</template>
```

---

### Events API

#### @click
Triggered when the button is clicked (unless disabled or loading).

### Slots API

#### #default
The main content slot for the button. Displays text, icons, or any other content inside the button. Content is hidden (but still rendered) when the button is in loading state to maintain button dimensions.

```vue
<template>
    <b-button>Slot: default</b-button>
</template>
```

**Important Notes:**
- When `loading` or `progress > 0`, the slot content becomes invisible but remains rendered to preserve button size
- You can include any Vue component or HTML element in the slot
- The slot content will automatically inherit button styles like text color and alignment
- For accessibility, consider using semantic elements when appropriate