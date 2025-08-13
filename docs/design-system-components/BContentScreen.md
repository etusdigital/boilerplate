# Name: b-content-screen
## Component Overview

**Purpose**: A full-screen layout component with left branding section and right content area, designed for multi-step workflows, onboarding, and form processes.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-content-screen v-model:progression="currentStep" :steps="totalSteps">
        <template #card-content>
            <div class="w-full p-base">
                <h3 class="font-bold mb-xs">Title</h3>
                <b-input placeholder="Type here" />
            </div>
        </template>
        <template #actions>
            <div class="w-full flex justify-between items-center">
                <a class="font-bold text-[12px] cursor-pointer hover:no-underline">
                    Previous
                </a>
                <b-button>Next</b-button>
            </div>
        </template>
    </b-content-screen>
</template>
```

---

### Props API

#### v-model:progression
Controls the current step or progress value. Type: `number` (default: `0`)

#### steps
Total number of steps for progress calculation. Type: `number` (default: `0`)

#### is-img-right
Positions the branding section on the right side. Type: `boolean` (default: `false`)

#### is-animated-logo
Enables rotating animation for the logo elements. Type: `boolean` (default: `false`)

---

### Events API

#### @update:progression
Triggered when the progression value changes.

### Slots API

#### #default
Replaces the entire right-side content area.

#### #bg-logo
Replaces the entire left-side branding area with custom content.

#### #bg-logo-label
Replaces only the text/logo portion in the branding area.

#### #logo
Replaces the logo in the right content area.

#### #progress-bar
Replaces the progress bar component.

#### #card
Replaces the entire card wrapper in the content area.

#### #card-content
Replaces the content inside the card.

#### #actions
Provides action buttons or navigation controls.

**Important Notes:**
- Component uses fullscreen layout with fixed positioning for the branding area
- Progress bar automatically calculates percentage based on progression and steps
- Left branding area is 28% width, right content area is 72%
- Use `is-img-right` to flip the layout for different design needs