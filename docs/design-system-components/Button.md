# Name: Button
## Component Overview

**Purpose**: A customizable button component with support for different colors, sizes, variants, loading states, and progress indicators.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Button>Label</Button>
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
    <Button type="button" @click="handleClick">Click me</Button>
    <Button type="submit">Submit Form</Button>
    <Button type="reset">Reset Form</Button>
</template>
```

#### color
Sets the button's color theme. Options: `"primary"` | `"info"` | `"success"` | `"warning"` | `"danger"` | `"neutral"` (default: `"primary"`)

```vue
<template>
    <div class="flex gap-xs">
        <Button color="primary">Primary</Button>
        <Button color="info">Info</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
        <Button color="neutral">Neutral</Button>
    </div>
</template>
```

#### size
Controls the button's dimensions and padding. Options: `"small"` | `"medium"` | `"large"` (default: `"medium"`)

```vue
<template>
    <div class="flex gap-xs">
        <Button class="h-fit" size="small">Small</Button>
        <Button class="h-fit" size="medium">Medium</Button>
        <Button class="h-fit" size="large">Large</Button>
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
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="plain">Plain</Button>
        <Button variant="reverse">Reverse</Button>
    </div>
</template>
```

#### disabled
Disables the button and prevents interactions. Type: `boolean` (default: `false`)

```vue
<template>
    <Button disabled>Disabled</Button>
</template>
```

#### loading
Shows a spinner and disables interactions. Type: `boolean` (default: `false`)

```vue
<template>
    <Button loading>Loading...</Button>
</template>
```

#### progress
Shows a progress bar overlay (0-1 range). When > 0, automatically enables loading state. Type: `number` (default: `0`)

```vue
<template>
    <div class="flex gap-xs">
        <Button :progress="0.3">30% Complete</Button>
        <Button :progress="0.75">75% Complete</Button>
        <Button :progress="1">Complete!</Button>
    </div>
</template>
```

#### round
Applies rounded border styling to the button. Type: `boolean` (default: `false`)

#### always-open
Keeps the button in an always-open state (used with round buttons). Type: `boolean` (default: `false`)

#### background
Custom background color for the button. Type: `string` (default: `""`)

#### id & name
HTML attributes for form handling and accessibility. Type: `string` (optional)

```vue
<template>
    <form>
        <!-- When id/name is provided, creates a label element for better accessibility -->
        <Button id="submit-btn" name="submit-button" type="submit">
            Submit Form
        </Button>
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
    <Button>Slot: default</Button>
</template>
```

**Important Notes:**
- When `loading` or `progress > 0`, the slot content becomes invisible but remains rendered to preserve button size
- You can include any Vue component or HTML element in the slot
- The slot content will automatically inherit button styles like text color and alignment
- For accessibility, consider using semantic elements when appropriate