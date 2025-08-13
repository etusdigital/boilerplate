# Name: b-divider
## Component Overview

**Purpose**: A visual divider component with text labels and flexible positioning for sectioning content and creating visual hierarchy in layouts.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-divider>
        Divider
    </b-divider>
</template>
```

---

### Props API

#### position
Controls the position of the divider lines relative to the text. Type: `'left' | 'center' | 'right'` (default: `'right'`)

---

### Events API

This component doesn't emit any events.

### Slots API

#### #default
The text content displayed between or alongside the divider lines. Text content is optional

```vue
<template>
    <b-divider>
        Slot: default
    </b-divider>
</template>
```

**Important Notes:**
- Simple and lightweight component focused on visual content separation
- Three position modes: 'left' (line on right), 'both' (lines on both sides), 'right' (line on left)
- Automatically spans full width with flexible line sizing
- Uses semantic styling with neutral colors for universal application
- Text content is bold and styled for clear hierarchy and readability
- Perfect for forms, dashboards, documentation, and content organization