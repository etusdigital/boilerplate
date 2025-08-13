# Name: b-alert
## Component Overview

**Purpose**: A flexible alert component for displaying important messages with different types, sizes, and interactive features like expandable content and close buttons.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-alert 
        title="Demo Title" 
        message="Lorem ipsum dolor sit amet consectetur. Ultricies urna mattis purus maecenas amet hac viverra id feugiat. Et dui maecenas at dui. Sagittis phasellus a massa praesent ultricies."
    />
</template>
```

---

### Props API

#### title
The alert title displayed prominently. Type: `string` (optional)

#### message
The main alert message content. Type: `string` (default: `""`)

#### type
Visual style and semantic meaning of the alert. Type: `"info" | "success" | "warning" | "danger" | "neutral"` (default: `"info"`)

#### size
Controls the alert dimensions and text sizes. Type: `"small" | "medium" | "large"` (default: `"medium"`)

#### icon
Custom icon name to override the default type icon. Type: `string` (default: `""`)

#### icon-position
Position of the icon relative to content. Type: `"start" | "center" | "end"` (default: `"start"`)

#### expandable
Makes the alert expandable to show/hide full message. Type: `boolean` (default: `false`)

#### closable
Adds a close button to dismiss the alert. Type: `boolean` (default: `false`)

#### hide-icon
Hides the alert icon completely. Type: `boolean` (default: `false`)

---

### Events API

#### @close
Triggered when the close button is clicked (only when `closable` is true).

### Slots API

#### #default
Replaces the entire content area (title and message). Useful for custom layouts.

```vue
<template>
    <b-alert type="success">
        <div class="flex flex-col gap-sm">
            <h3 class="font-bold text-lg">Custom Content</h3>
            <p>You can put any custom content here instead of using title and message props.</p>
            <div class="flex gap-sm">
                <b-button size="small">Action 1</b-button>
                <b-button size="small" variant="secondary">Action 2</b-button>
            </div>
        </div>
    </b-alert>
</template>
```

#### #actions
Replaces the default action area (expand/close buttons). Useful for custom actions.

```vue
<template>
    <b-alert 
        title="Custom Actions" 
        message="This alert has custom action buttons."
        type="warning"
    >
        <template #actions>
            <div class="flex gap-xs">
                <b-button size="small" variant="plain">
                    <b-icon name="refresh" />
                </b-button>
                <b-button size="small" variant="plain">
                    <b-icon name="share" />
                </b-button>
                <b-button size="small" variant="plain">
                    <b-icon name="close" />
                </b-button>
            </div>
        </template>
    </b-alert>
</template>
```

**Important Notes:**
- Default icons are automatically assigned based on alert type
- Component automatically handles height transitions for expandable content
- Use meaningful types that match the semantic meaning of your message
- Consider accessibility when using custom icons or colors