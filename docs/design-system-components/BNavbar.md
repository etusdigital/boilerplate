# Name: b-navbar
## Component Overview

**Purpose**: A comprehensive navigation bar component with logo area, dropdown menu navigation, notifications system, and user profile integration for application headers.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-navbar
        v-model="selectedItem"
        title="My Application"
        :items="navigationItems"
        :profile="userProfile"
    >
        <template #notifications>
            <div class="p-base max-w-sm">
                <h4 class="font-semibold mb-sm">Recent Activity</h4>
                <div class="space-y-xs">
                    <div class="text-sm">New user registered</div>
                    <div class="text-sm">System backup completed</div>
                    <div class="text-sm">5 new messages</div>
                </div>
            </div>
        </template>
    </b-navbar>
</template>

<script setup lang="ts">

const selectedItem = ref("dashboard")

const userProfile = ref({
    name: "John Doe",
    src: "/avatar.jpg"
})

const navigationItems = ref([
    {
        label: "Dashboard",
        value: "dashboard",
        icon: "dashboard"
    },
    {
        label: "Analytics",
        value: "analytics", 
        icon: "analytics",
        items: [
            { label: "Reports", value: "reports", icon: "assessment" },
            { label: "Metrics", value: "metrics", icon: "bar_chart" }
        ]
    },
    {
        label: "Settings",
        value: "settings",
        icon: "settings",
        bottom: true
    }
])
</script>
```

---

### Props API

#### v-model
The currently selected navigation item. Type: `Item` (default: `undefined`)

```typescript
type Item = {
  label: string;        // Display text for the item
  value: string;        // Unique identifier
  icon?: string;        // Optional icon name
  disabled?: boolean;   // Whether the item is disabled
  bottom?: boolean;     // Whether to display at bottom of menu
  items?: Item[];       // Nested sub-items
}
```

#### title
Title text displayed in the navbar brand area. Type: `string` (default: `""`)

#### items
Array of navigation menu items with nested support. Type: `Item[]` (default: `undefined`)

#### profile
User profile information for avatar display. Type: `Profile` (default: `undefined`)

```typescript
type Profile = {
  name: string;    // User's display name
  src?: string;    // Optional avatar image URL
}
```

#### label-key
Property name used for displaying item labels when using object arrays. Type: `string` (default: `"label"`)

#### value-key
Property name used for item values when using object arrays. Type: `string` (default: `"value"`)

#### get-object
Returns complete objects instead of just values when enabled. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when a navigation item is selected. Receives the selected item object.

### Slots API

#### #default
Custom navigation content in the center area.

#### #logo
Complete replacement for the logo and title area.

#### #title
Custom content for the title area (when using default logo).

#### #actions
Custom content for the right side actions area.

#### #notifications
Content displayed in the notifications dropdown panel.

**Important Notes:**
- Built-in notification system with customizable dropdown content and positioning
- Dropdown menu integration with BDropdown component for navigation hierarchy
- User profile avatar display with BAvatar component integration
- Flexible slot system allows complete customization of logo, navigation, and actions
- Responsive design adapts to different screen sizes and layouts
- Dynamic positioning system for notifications dropdown prevents viewport overflow
- Smooth transitions and animations for enhanced user experience
- Keyboard navigation support for accessibility compliance
- Z-index management ensures proper layering over page content
- Support for nested navigation items with unlimited depth
- Bottom-aligned menu items for logout/settings functionality