# Name: Profile
## Component Overview

**Purpose**: A user profile dropdown component with account switching capabilities, profile management actions, and customizable content areas for user authentication workflows.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Profile
        v-model="selectedAccount"
        :name="currentUser.name"
        :picture="currentUser.picture"
        :options="userAccounts"
        @logout="handleLogout"
        @edit="editProfile"
        @edit-option="editAccount"
        @privacy-policy-function="openPrivacyPolicy"
        @terms-of-use-fucntion="openTermsOfUse"
    >
        <template #edit-slot>
            Edit profile
        </template>
        <template #edit-option>
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
    </Profile>
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
The currently selected account/profile option. Type: `any` (default: `undefined`)

#### name
The main user name displayed in the profile. Type: `string` (required)

#### picture
URL of the user's profile picture image. Type: `string` (default: `""`)

#### options
Array of account options for multi-account selection. Type: `any[]` (default: `[]`)

#### label-key
Property name for option labels in the options array. Type: `string` (default: `"label"`)

#### value-key
Property name for option values in the options array. Type: `string` (default: `"value"`)

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

#### @edit-option
Triggered when the edit account action is clicked.

#### @privacy-policy-function
Triggered when the privacy policy link is clicked.

#### @terms-of-use-fucntion
Triggered when the terms of use link is clicked.

### Slots API

#### #edit-slot
Custom content for the edit profile button.

#### #edit-option
Custom content for the edit account button.

#### #logout-slot
Custom content for the logout button.

#### #option
Custom rendering for account selection options.

```vue
<template>
    <Profile
        v-model="selectedAccount"
        :name="userName"
        :options="accounts"
    >
        ...
        <template #option="{ option, index, active }">
            <div class="flex items-center gap-xs">
                <icon name="account_circle" />
                <span :class="{'underline': active }">{{ option.label }}</span>
            </div>
        </template>
    </Profile>
</template>
```

#### #privacy-policy
Custom content for the privacy policy link.

#### #terms-of-use
Custom content for the terms of use link.

**Important Notes:**
- Built on top of SelectContainer for consistent dropdown behavior and styling
- Integrated search functionality for filtering through multiple accounts when available
- Profile picture support with fallback to default icon when no image is provided
- Flexible account/profile switching with support for both simple values and complex objects
- Customizable action buttons for profile management, account editing, and logout functionality
- Built-in privacy policy and terms of use links with customizable content and actions
- Slot-based architecture allows complete customization of account list options and action buttons
- Responsive dropdown positioning prevents viewport overflow issues
- Keyboard navigation support for accessibility compliance
- Event-driven architecture enables integration with authentication and user management systems
- Support for disabled state to prevent interaction during loading or unauthorized access
- Absolute positioning option for complex layout scenarios
- Search functionality helps users quickly find specific accounts in long lists
- Professional styling suitable for both consumer and enterprise applications