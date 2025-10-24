# Name: ColorPicker
## Component Overview

**Purpose**: An advanced color picker component with multiple color format support, interactive canvas-based selection, and real-time preview for comprehensive color management and customization.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <ColorPicker 
        v-model="selectedColor"
        @update:model-value="handleColorChange"
    />
</template>

<script setup lang="ts">

const selectedColor = ref("#ff0000")
</script>
```

---

### Props API

#### v-model
Controls the selected color value in the specified format. Type: `string` (default: `undefined`)

#### type
The color format for input and output values. Type: `'hexa' | 'hsla' | 'hwb' | 'hsva' | 'rgba'` (default: `"hexa"`)

- **hexa**: Hexadecimal format with alpha channel (`#rrggbbaa`)
- **hsla**: Hue, Saturation, Lightness, Alpha (`h, s%, l%, a`)
- **hwb**: Hue, Whiteness, Blackness with alpha (`h w% b% / a`)
- **hsva**: Hue, Saturation, Value, Alpha (`h, s%, v%, a`)
- **rgba**: Red, Green, Blue, Alpha (`r, g, b, a`)

#### no-shadow
Removes the card shadow and border for integration into custom layouts. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when the color value changes through user interaction. Receives the new color value in the selected format.

#### @update:type
Triggered when the color format type is changed using the format selector. Receives the new format type.

### Slots API

This component uses internal canvas and control rendering and doesn't expose custom slots.

**Important Notes:**
- Interactive canvas-based color selection with real-time preview and pixel-perfect accuracy
- Support for five major color formats with seamless conversion between formats
- Advanced UI with separate hue slider, opacity control, and saturation/brightness canvas
- Touch-friendly controls with both mouse and touch event handling for mobile compatibility
- Real-time color format switching with animated transitions and preserved color values
- Drag-and-drop interface for all color components (hue, saturation, brightness, opacity)
- Automatic color space calculations and conversions maintain color accuracy across formats
- Canvas-based rendering provides smooth gradients and precise color selection capabilities
- Built-in input field allows direct color value entry with automatic validation and cursor positioning
- Responsive design adapts to container width while maintaining proper aspect ratios and usability