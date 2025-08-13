# Name: b-profile
## Component Overview

**Purpose**: A user profile dropdown component with account switching capabilities, profile management actions, and customizable content areas for user authentication workflows.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <b-profile
        v-model="selectedAccount"
        :name="currentUser.name"
        :picture="currentUser.picture"
        :items="userAccounts"
        @logout="handleLogout"
        @edit="editProfile"
        @edit-item="editAccount"
        @privacy-policy-function="openPrivacyPolicy"
        @terms-of-use-fucntion="openTermsOfUse"
    >
        <template #edit-slot>
            Edit profile
        </template>
        <template #edit-item>
            Edit account
        </template>
        <template #logout-slot>
            Logout
        </template>
        <template #privacy-policy>
            Privacy Policy
        </template>
        <template #terms-of-use>
            Terms Of Use
        </template>
    </b-profile>
</template>

<script setup lang="ts">

const selectedAccount = ref(...)
const currentUser = ref(...)
const userAccounts = ref([...])

const handleLogout = () => {}
const editProfile = () => {}
const editAccount = () => {}
const openPrivacyPolicy = () => {}
const openTermsOfUse = () => {}
</script>
```

---

### Props API

#### v-model
The currently selected account/profile item. Type: `any` (default: `undefined`)

#### name
The main user name displayed in the profile. Type: `string` (required)

#### picture
URL of the user's profile picture image. Type: `string` (default: `""`)

#### items
Array of account items for multi-account selection. Type: `any[]` (default: `[]`)

#### label-key
Property name for item labels in the items array. Type: `string` (default: `"label"`)

#### value-key
Property name for item values in the items array. Type: `string` (default: `"value"`)

#### absolute
Controls absolute positioning of the dropdown. Type: `boolean` (default: `false`)

#### disabled
Disables the profile interaction. Type: `boolean` (default: `false`)

#### get-object
Returns complete objects instead of just values when enabled. Type: `boolean` (default: `false`)

---

### Events API

#### @update:model-value
Triggered when an account is selected. Receives the selected value or object.

#### @logout
Triggered when the logout action is clicked.

#### @edit
Triggered when the edit profile action is clicked.

#### @edit-item
Triggered when the edit account action is clicked.

#### @privacy-policy-function
Triggered when the privacy policy link is clicked.

#### @terms-of-use-fucntion
Triggered when the terms of use link is clicked.

### Slots API

#### #edit-slot
Custom content for the edit profile button.

#### #edit-item
Custom content for the edit account button.

#### #logout-slot
Custom content for the logout button.

#### #item
Custom rendering for account selection items.

```vue
<template>
    <b-profile
        v-model="selectedAccount"
        :name="userName"
        :items="accounts"
    >
        ...
        <template #item="{ item, index, active }">
            <div class="flex items-center gap-xs">
                <b-icon name="account_circle" />
                <span :class="{'underline': active }">{{ item.label }}</span>
            </div>
        </template>
    </b-profile>
</template>
```

#### #privacy-policy
Custom content for the privacy policy link.

#### #terms-of-use
Custom content for the terms of use link.

**Important Notes:**
- Built on top of BSelectContainer for consistent dropdown behavior and styling
- Integrated search functionality for filtering through multiple accounts when available
- Profile picture support with fallback to default icon when no image is provided
- Flexible account/profile switching with support for both simple values and complex objects
- Customizable action buttons for profile management, account editing, and logout functionality
- Built-in privacy policy and terms of use links with customizable content and actions
- Slot-based architecture allows complete customization of account list items and action buttons
- Responsive dropdown positioning prevents viewport overflow issues
- Keyboard navigation support for accessibility compliance
- Event-driven architecture enables integration with authentication and user management systems
- Support for disabled state to prevent interaction during loading or unauthorized access
- Absolute positioning option for complex layout scenarios
- Search functionality helps users quickly find specific accounts in long lists
- Professional styling suitable for both consumer and enterprise applications