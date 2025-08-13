# Name: b-metric-card
## Component Overview

**Purpose**: A flexible metric display card component with multiple visual themes, loading states, and customizable content slots for showcasing key performance indicators and statistical data.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-base">
        <b-metric-card
            title="Total Revenue"
            value="$124,500"
            description="+12% from last month"
            icon="trending_up"
            type="success"
            @click="viewDetails"
        />
        
        <b-metric-card
            title="Active Users"
            value="2,450"
            description="+5% from last week"
            icon="people"
            :loading="isLoading"
        />
        
        <b-metric-card
            title="Conversion Rate"
            value="3.2%"
            description="-0.5% from last month"
            icon="analytics"
            type="danger"
            info-message="Below target"
            info-type="warning"
        />
    </div>
</template>

<script setup lang="ts">

const isLoading = ref(false)

const viewDetails = () => {
    console.log('View revenue details')
}
</script>
```

---

### Props API

#### title
The main title displayed at the top of the card. Type: `string` (default: `""`)

#### value
The primary metric value to be displayed prominently. Type: `string | number` (default: `""`)

#### description
Additional descriptive text or secondary metric. Type: `string | number` (default: `""`)

#### icon
Icon name to display alongside the title. Type: `string` (default: `""`)

#### type
Visual theme variant for the card styling. Type: `"default" | "dashed" | "card"` (default: `"default"`)

#### size
Size variant affecting typography and spacing. Type: `"small" | "medium" | "large"` (default: `"medium"`)

#### color
Custom color for the value text (only applies to 'card' type). Type: `"primary" | "info" | "success" | "danger" | "warning" | "neutral"` (default: `"neutral"`)

#### info-message
Additional informational message displayed with tooltip or text. Type: `string` (default: `""`)

#### info-type
Color theme for the info message display. Type: `"primary" | "info" | "success" | "danger" | "warning" | "neutral"` (default: `"neutral"`)

#### tooltip-min-width
Minimum width for the info tooltip container. Type: `string` (default: `"none"`)

#### loading
Shows skeleton loading animation instead of content. Type: `boolean` (default: `false`)

#### no-tooltip
Displays info message as text instead of in a tooltip. Type: `boolean` (default: `false`)

#### bold-title
Makes the title text bold for emphasis. Type: `boolean` (default: `false`)

---

### Events API

This component does not emit custom events but supports standard DOM events like `@click`.

### Slots API

#### #default
Additional content displayed below the main card information.

```vue
<template>
    <b-metric-card
        class="w-fit"
        title="Your June recipe"
        value="$100,000.00"
        color="primary"
        type="card"
        size="large"
        bold-title
    >
        <template #description-slot>
            <div class="flex items-center h-full pt-xs">
                <b-tooltip text="info">
                    <b-icon name="info" class="info-icon" />
                </b-tooltip>
            </div>
        </template>
        <div class="flex flex-col gap-sm mt-sm">
            <div class="flex items-center gap-xs text-neutral-foreground-high">
                <b-icon name="calendar_month" class="calendar-icon" />
                <p class="text-sm">Payment will be made by 04/30/2024</p>
            </div>
        <div class="flex gap-xs self-end">
            <b-tag text="Processing payment" size="small" />
            <b-button variant="secondary" size="small">
                View Details
            </b-button>
        </div>
        </div>
    </b-metric-card>
</template>

<style scoped>
.info-icon.b-icon {
    @apply text-lg text-neutral-interaction-default
}

.calendar-icon.b-icon {
    @apply text-base;
}
```

#### #title-slot
Custom content to replace the default title text.

#### #value-slot
Custom content to replace the default value display.

#### #description-slot
Custom content to replace the default description text.

#### #content
Custom content to replace both value and description sections.

#### #info
Custom content displayed next to the title for additional information.

**Important Notes:**
- Built on top of BCard component for consistent styling and layout
- Skeleton loading animation provides smooth user experience during data fetching
- Multiple theme variants (default, dashed, card) for different contexts
- Flexible sizing system (small, medium, large) adapts to various dashboard layouts
- Info message system with tooltip or text display options for additional context
- Icon integration enhances visual hierarchy and quick recognition
- Slot-based architecture allows complete customization of content areas
- Responsive typography that scales appropriately across different sizes
- Loading state management prevents layout shift during data updates
- Accessibility support with proper semantic structure and color contrast