# Name: FileUpload
## Component Overview

**Purpose**: A dedicated file upload component with drag-and-drop support, file type restrictions, multiple file selection, and visual feedback for file upload operations.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <FileUpload 
        v-model="uploadedFile"
        label-value="Upload Document"
        placeholder="Select a file or drag it here"
    />
</template>

<script setup lang="ts">

const uploadedFile = ref<File>()
</script>
```

---

### Props API

#### v-model
Controls the uploaded file(s). Type: `File | File[] | undefined` (default: `undefined`)

#### label-value
The label displayed above the file upload area. Type: `string` (default: `""`)

#### accept
Specifies the types of files that can be uploaded. Type: `string` (default: `undefined`)

```vue
<template>
    <FileUpload 
        v-model="image"
        label-value="Upload Image"
        accept=".jpg,.jpeg,.png,.gif"
        info-message="Only image files allowed"
    />
</template>

<script setup lang="ts">

const image = ref<File>()
</script>
```

#### multiple
Allows multiple file selection. Type: `boolean` (default: `false`)

#### is-error
Activates error styling mode. Type: `boolean` (default: `false`)

#### error-message
Error message to display when in error state. Type: `string` (default: `""`)

#### info-message
Informational message displayed with tooltip. Type: `string` (default: `""`)

#### size
File upload component size. Type: `'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'` (default: `"medium"`)

#### disabled
Disables file upload interaction. Type: `boolean` (default: `false`)

#### placeholder
Placeholder text for the file upload area. Type: `string` (default: `"or drag and drop it here"`)

---

### Events API

#### @update:model-value
Triggered when files are selected or uploaded. Receives the File object(s) or undefined when files are removed.

---

### Slots API

#### #uploaded-file
Custom content for displaying uploaded file information. This slot is shown when files are successfully uploaded and allows complete customization of the file display.

**Important Notes:**
- Full drag-and-drop support for intuitive file selection
- File type restrictions using the `accept` attribute (MIME types or file extensions)
- Support for single or multiple file uploads
- Visual feedback during drag operations with blur effect
- Customizable file display through the `uploaded-file` slot
- Responsive sizing options from extra small to full width
- Built-in accessibility features and keyboard navigation
- Error handling and visual feedback for upload failures
- Disabled state support to prevent uploads when needed
- Clean, modern UI with consistent design system integration