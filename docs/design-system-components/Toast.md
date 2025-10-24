# Name: toast
## Function Overview

**Purpose**: A programmatic toast notification function that displays temporary messages with various types, positioning options, and action buttons for user feedback and status updates.

**Usage**: Function-based API - no direct component import needed

**Import**: Import it using inject function `inject('toast')`

<br />
### Basic Usage

```vue
<template>
   <button @click="showToast">Show Toast</button>
</template>

<script setup lang="ts">

const toast = inject('toast') as Function

const showToast = () => {
    toast({
        title: 'Success',
        message: 'Your changes have been saved successfully!',
        type: 'success',
        top: true,
        right: true,
        timeout: 3500
    })
}
</script>
```

---

### Function API

#### toast(options)
Displays a toast notification with the specified configuration.

**Parameters**: `ToastOptions` (required)

```typescript
type ToastOptions = {
  title?: string;          // Toast title text
  message: string;         // Main toast message
  type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral'; // Toast type (default: 'danger')
  top?: boolean;           // Position at top of screen
  bottom?: boolean;        // Position at bottom of screen
  right?: boolean;         // Position at right of screen
  left?: boolean;          // Position at left of screen
  timeout?: number;        // Auto-dismiss time in milliseconds
  buttonLabel?: string;    // Action button text
  action?: () => void;     // Function executed when button is clicked
}
```

**Returns**: `void` (fire-and-forget function)

#### Access Methods

**Composition API (Recommended)**
```javascript

const toast = inject('toast') as Function
```

**Options API (Legacy)**
```javascript
this.$toast({
    title: 'Notification',
    message: 'Operation completed',
    type: 'info',
    top: true,
    right: true,
    timeout: 3500
})
```

---

### Usage Patterns

#### Action Button
```javascript
const showLowStorageWarning = () => {
    toast({
        title: 'Storage Warning',
        message: 'You are running low on storage space.',
        type: 'warning',
        bottom: true,
        left: true,
        buttonLabel: 'Manage Storage',
        action: () => {
            navigateToStorageSettings()
        },
        timeout: 5000
    })
}
```

#### Positioning Examples
```javascript
toast({ message: 'Success!', type: 'success', top: true, right: true })
toast({ message: 'Success!', type: 'success', top: true, left: true })
toast({ message: 'Success!', type: 'success', bottom: true, left: true })
toast({ message: 'Success!', type: 'success', bottom: true, right: true })
```

---

### Setup Requirements

#### Component Registration
The `<toast />` component must be included **only once** in your application root, preferably in `App.vue`:

```vue
<!-- App.vue -->
<template>
    <!-- Your app content -->
    <router-view />
    
    <!-- Required for toast notifications - Add only once -->
    <toast />
</template>
```

**Important**: Do not add `<toast />` to individual components. It should only be present once in your entire application.

#### Service Injection
The toast function is available through Vue's dependency injection system and requires proper setup in your application configuration.

---

### Event System

The toast system uses an internal event system to communicate between the function call and the toast component:

- **Function Call** → Triggers `open-toast` event
- **Auto-dismiss/Manual Close** → Triggers `close-toast` event
- **Action Button Click** → Executes provided action function

**Important Notes:**
- Multiple toasts can be displayed simultaneously in different positions
- Toasts auto-dismiss based on timeout (if specified)
- Position constraints: use only one vertical (top/bottom) and one horizontal (left/right) position
- Requires `<toast />` component in application root **only once** (preferably in App.vue)
- Uses dependency injection for clean API access
- Fire-and-forget function - no return value needed
- Responsive design automatically adjusts toast width on mobile devices