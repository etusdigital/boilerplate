# Name: Badge
## Component Overview

**Purpose**: A versatile tag component with custom color schemes for specialized labeling and categorization.

**Prefer StatusBadge for standard status indicators** - use Badge only when theme colors don't meet your specific design requirements.

**Import**: Automatic - no need to import any DS components

### Basic Usage

> **Recommendation:** Use StatusBadge for standard status indicators (primary, info, success, warning, error, neutral). Badge is intended for custom color requirements not covered by the design system theme.

```vue
<template>
    <Badge 
        label-value="Custom Brand"
        color="#000000"
        icon="star"
    />
</template>
```

---

### Props API

#### label-value
The text content displayed in the tag. Type: `string` (default: `""`)

#### color
Custom color for specialized branding or design requirements. Type: `string` (default: `""`)

> **Note:** For standard semantic colors (primary, info, success, warning, error, neutral), use StatusBadge instead.

#### size
Badge size variant affecting padding and font size. Type: `"small" | "medium" | "large"` (default: `"medium"`)

#### type
Visual style variant affecting background and border appearance. Type: `"default" | "secondary" | "heavy"` (default: `"default"`)

#### loading
Shows spinner animation instead of content. Type: `boolean` (default: `false`)

#### icon
Icon name to display within the tag. Type: `string` (default: `""`)

#### is-appended-icon
Controls icon position - when true, icon appears after text. Type: `boolean` (default: `false`)

#### closeable
Adds close button functionality with click event emission. Type: `boolean` (default: `false`)

---

### Events API

#### @close
Triggered when the close button is clicked (only when `closeable` is true).

### Slots API

#### #default
Content displayed instead of text prop when provided.

```vue
<template>
    <Badge>
       Slot: default
    </Badge>
</template>
```

**Important Notes:**
- **Use StatusBadge for standard status indicators** - Badge is for custom color requirements only
- Three visual types: default (filled), secondary (outlined), heavy (high contrast)
- Custom color support for branding and specialized design requirements
- Icon positioning supports both prepend (default) and append modes
- Close functionality automatically adds close icon when enabled
- Loading state replaces all content with animated spinner
- Text automatically truncates with ellipsis for long content
- Responsive sizing with proportional icon scaling
- Accessibility support with proper contrast ratios in all color combinations