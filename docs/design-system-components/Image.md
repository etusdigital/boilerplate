# Name: Image
## Component Overview

**Purpose**: A responsive image component with built-in preview functionality, featuring zoom, rotation controls, and customizable overlays for enhanced user experience.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Image src="/image.jpg" alt="Sample image" width="250" />
</template>
```

---

### Props API

#### src
The image source URL or path. Type: `string` (optional)

#### alt
Alternative text for accessibility. Type: `string` (optional)

#### width
Width of the image (can be string with units or number for pixels). Type: `string | number` (optional)

#### height
Height of the image (can be string with units or number for pixels). Type: `string | number` (optional)

#### icon
Icon name for the preview overlay. Type: `string` (default: `"visibility"`)

The icon displayed when hovering over an image with preview enabled.

#### preview
Enable preview mode with modal overlay and transformation controls. Type: `boolean` (default: `false`)

When enabled, clicking the image opens a modal with zoom and rotation controls.

```vue
<template>
    <Image src="/image.jpg" alt="Sample image" width="250" preview />
</template>
```

---

### Events API

#### @show
Emitted when the preview modal is opened.

#### @hide
Emitted when the preview modal is closed.

---

### Slots API

#### #image
Custom slot for the main image content. Allows complete customization of the displayed image.

#### #image-overlay
Custom slot for the preview overlay icon. Default shows a visibility icon.

#### #preview
Custom slot for the preview modal image with access to transformation styles and click handler.

---

### Accessibility Features

- **ARIA Support**: Preview modal uses proper `role="dialog"` and `aria-modal` attributes
- **Keyboard Navigation**: 
  - `Escape` key closes the preview modal
  - `Tab` navigation through preview controls
  - `Enter/Space` activates control buttons
- **Screen Reader**: All control buttons have proper `aria-label` attributes
- **Focus Management**: Initial focus on close button when preview opens

**Important Notes:**
- Always provide meaningful `alt` text for images
- The component automatically handles image scaling and aspect ratios
- Preview functionality works with any image format
- Modal overlay prevents body scrolling while open
- All transformations reset when closing preview modal