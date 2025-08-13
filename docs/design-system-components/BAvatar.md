# Name: b-avatar
## Component Overview

**Purpose**: A circular avatar component that displays user profile images or automatically generated initials from names, with support for multiple sizes.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-avatar name="John Doe" />
</template>
```

---

### Props API

#### name
The user's name used to generate initials when no image is provided. Type: `string` (optional)

#### src
URL or path to the avatar image. When provided, displays the image instead of initials. Type: `string` (optional)

#### alt
Alternative text for the avatar image (accessibility). Type: `string` (optional, defaults to name)

#### size
Controls the avatar's dimensions. Options: `"small"` | `"medium"` | `"large"` (default: `"medium"`)

```vue
<template>
    <div class="flex gap-sm">
        <b-avatar name="John Doe" size="small" />
        <b-avatar name="John Doe" size="medium" />
        <b-avatar name="John Doe" size="large" />
    </div>
</template>
```

---

### Events API

BAvatar does not emit any custom events. It's a display component that passes through standard DOM events from the underlying div element.

---

### Slots API

BAvatar does not use slots. All content is controlled through props (`name`, `src`, `alt`, `size`). The component automatically handles the display logic between images and initials.

**Important Notes:**
- The component automatically chooses between image and initials display
- Image takes priority over initials when both name and src are provided
- All sizes maintain the same circular aspect ratio
- Use semantic alt text for better accessibility when providing images