<template>
  <Drawer v-model="model" size="40%" @update:model-value="updateModelValue">
    <div v-if="props.loadingUserData" class="form-wrapper">
      <Skeleton v-for="i in 4" :key="i" />
    </div>
    <div class="form-wrapper" v-else>
      <div class="form-header">
        <h2>{{ isEditing ? t('users.edit_user') : t('users.invite_user') }}</h2>
        <Button icon="close" size="small" variant="plain" color="neutral" round @click="closeForm" />
      </div>
      <div class="form-content">
        <Avatar
          v-if="editingUser.profileImage"
          :src="editingUser.profileImage"
          :name="editingUser.name"
          :alt="t('users.roles.profileImage')"
        />
        <Input
          v-model="editingUser.name"
          :error-message="t('usersPage.validation.name')"
          :label-value="t('name')"
          required
        />

        <Input
          v-model="editingUser.email"
          :label-value="t('email')"
          :error-message="t('usersPage.validation.email')"
          required
          :disabled="isEditing"
          type="email"
        />

        <Textarea
          v-if="isSameUser"
          v-model="editingUser.profileImage"
          :label-value="t('users.roles.profileImage')"
          :is-error="!isValidUrl"
          :error-message="t('users.roles.profileImage')"
          required
        />

        <Checkbox v-model="editingUser.isSuperAdmin" @update:model-value="changeSuperAdmin">
          {{ t('users.roles.isSuperAdmin') }}
        </Checkbox>

        <div class="flex flex-col gap-sm">
          <div class="flex flex-row gap-sm items-center">
            <h5>{{ t('users.roles.userPermissionsPerAccount') }}</h5>
            <Button v-if="allAccountsParsed.length" size="small" round @click="addRole" />
          </div>
          <div
            v-for="(permission, index) in parsedPermissions"
            :key="permission.accountId"
            class="flex items-center gap-sm w-full"
          >
            <Select v-model="permission.accountId" :options="allAccountsParsed" absolute searchable />
            <Select v-model="permission.role" :options="roleOptions" absolute />
            <Button
              class="w-fit h-fit"
              icon="delete"
              size="small"
              variant="plain"
              color="danger"
              round
              @click="removeRole(index)"
            />
          </div>
        </div>
      </div>
      <div class="form-actions">
        <Button variant="secondary" @click="closeForm">
          {{ t('cancel') }}
        </Button>
        <Button :disabled="!saveConditions" @click="handleSave">
          {{ t('save') }}
        </Button>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { inject, ref, watch, computed } from 'vue'
import type { User } from '@/features/users/types/user.type'
import type { Account } from '@/features/accounts/types/account.type'
import { useUserForm } from '@/features/users/composables/useUserForm'

const props = defineProps<{
  modelValue: boolean
  user: User
  allAccounts: Array<Account>
  loadingUserData?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', user: User, isEditing: boolean): void
  (e: 'close', user?: User | null): void
  (e: 'update:modelValue', value: boolean): void
}>()

const t = inject('t') as Function

const {
  model,
  isSameUser,
  editingUser,
  allAccountsParsed,
  parsedPermissions,
  isEditing,
  isValidUrl,
  isValidEmail,
  editingUserBind,
  updateSelectedPermissions,
  changeSuperAdmin,
  updateModelValue,
  closeForm,
} = useUserForm(props, emit)

const roleOptions = ref([
  { label: 'Reader', value: 'reader' },
  { label: 'Writer', value: 'writer' },
  { label: 'Admin', value: 'admin' },
])

const saveConditions = computed(() => {
  return (
    editingUser.value.name?.length &&
    ((isValidUrl.value && isSameUser.value) || !isSameUser.value) &&
    isValidEmail.value &&
    parsedPermissions.value.filter((permission) => permission.accountName && permission.role).length ==
      parsedPermissions.value.length
  )
})

watch(
  () => parsedPermissions.value,
  () => {
    updateSelectedPermissions(parsedPermissions.value)
  },
)

function handleSave() {
  emit('save', editingUserBind.value, isEditing.value)
}

function addRole() {
  const destruc = { ...allAccountsParsed.value[0] }
  parsedPermissions.value.push({
    accountId: destruc.value,
    role: 'reader',
    accountName: destruc.label,
  })
}

function removeRole(index: number) {
  parsedPermissions.value.splice(index, 1)
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.form-wrapper {
  @apply flex flex-col gap-sm h-screen p-lg;
}

.form-header {
  @apply flex justify-between items-center gap-sm;
}

.form-content {
  @apply flex flex-col gap-base w-full flex-1;
}

.form-actions {
  @apply flex justify-end gap-sm;
}
</style>
