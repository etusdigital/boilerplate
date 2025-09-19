# Name: Crop
## Component Overview

**Purpose**: An advanced image cropping component with interactive drag-and-drop selection, zoom controls, and real-time preview for precise image editing and content preparation.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Crop 
        v-model="croppedImage"
        :src="originalImage"
        width="360px"
        height="200px"
    />
</template>

<script setup lang="ts">

const croppedImage = ref("")
const originalImage = ref("/path/to/image.jpg")
</script>
```

---

### Props API

#### v-model
Controls the cropped image output as a base64 data URL. Type: `string` (default: `undefined`)

#### src
The source image URL or path to be cropped. Type: `string` (required)

#### width
The width of the crop area selection box. Type: `string` (default: `"360px"`)

#### height
The height of the crop area selection box. Type: `string` (default: `"200px"`)
---

### Events API

#### @update:model-value
Triggered when the crop area changes or zoom is adjusted. Receives the cropped image as a base64 data URL.

### Slots API

This component uses internal canvas-based rendering and doesn't expose custom slots.

**Important Notes:**
- Interactive crop area with drag-and-drop positioning for precise selection control
- Built-in zoom functionality with slider control for detailed image editing
- Real-time preview shows the exact cropped result with immediate visual feedback
- Canvas-based rendering ensures high-quality output with pixel-perfect accuracy
- Responsive design adapts to container size while maintaining aspect ratios
- Touch-friendly controls support both mouse and touch interactions for mobile compatibility
- SVG masking creates clean crop boundaries with smooth rounded corners
- Automatic image scaling and positioning centers content optimally within the viewport
- Memory-efficient processing handles large images without performance degradation
- ResizeObserver integration ensures proper scaling when container dimensions change
- Base64 output format provides immediate usability for uploads or display purposes
- Advanced coordinate calculations maintain precision across different zoom levels and positions