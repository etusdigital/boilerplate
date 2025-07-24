<template>
  <b-sidebar v-model="model" :noOutsideClose="false" width="40%" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <div class="form-header flex flex-row items-center gap-4">
        <BIcon name="close" @click="closeForm" class="cursor-pointer" />
        <div class="title">{{ isEditing ? t('users.editUser') : t('users.inviteUser') }}</div>
        <div class="save-container">
          <b-button color="success" :disabled="false" :loading="false" size="medium" type="button"
            @click="emit('save', editingUserBind, isEditing)">
            {{ isEditing ? t('save') : t('sendInvite') }}
          </b-button>
        </div>
      </div>
      <div class="form-content">
        <div class="profile-img-wrapper">
          <img
            :src="!!editingUser.profileImage ? editingUser.profileImage : 'https://stbbankstown.syd.catholic.edu.au/wp-content/uploads/sites/130/2019/05/Person-icon.jpg'"
            :alt="t('users.roles.profileImage')" class="profile-img" />
        </div>
        <div class="flex flex-col items-start justify-between w-full gap-xl">
          <BInput v-model="editingUser.name" :errorMessage="t('users.validation.name')" :labelValue="t('name')"
            :required="true" size="base" type="text" />

          <BInput v-model="editingUser.email" :errorMessage="t('usersPage.validation.email')" :isError="false"
            :isTextArea="false" labelValue="Email" :required="true" size="base" type="email" :disabled="isEditing" />

          <BInput v-if="isSameUser" v-model="editingUser.profileImage" :errorMessage="t('users.validation.invalidUrl')"
            :isError="!isValidUrl" :isTextArea="false" :labelValue="t('users.roles.profileImage')" :required="true" size="base"
            type="text" />

          <UserRolesSelect :roles="parsedPermissions" :allAccounts="allAccountsParsed" :allowSuperAdmin="true"
            @roles-updated="updateSelectedPermissions" @change-super-admin="changeSuperAdmin"
            :isSuperAdmin="editingUser.isSuperAdmin" />

        </div>
      </div>
    </div>

    <div class="form-actions">
    </div>
  </b-sidebar>
</template>

<script setup lang="ts">
import type { User } from '@/features/users/types/user.type';
import type { Account } from '@/features/accounts/types/account.type';
import { useUserForm } from '@/features/users/composables/useUserForm';
import UserRolesSelect from './UserRolesSelect.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean;
  user: User;
  allAccounts: Array<Account>;
}>();

const emit = defineEmits<{
  (e: 'save', user: User, isEditing: boolean): void;
  (e: 'close', user?: User | null): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const {
  model,
  isSameUser,
  editingUser,
  allAccountsParsed,
  parsedPermissions,
  isEditing,
  isValidUrl,
  editingUserBind,
  updateSelectedPermissions,
  changeSuperAdmin,
  updateModelValue,
  closeForm,
} = useUserForm(props, emit);

</script>

<style>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 50px;
}

.form-container {
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  position: absolute;
  bottom: 0;
  width: calc(100% - 60px);
  margin: 30px;
}

.profile-img-wrapper {
  margin: 20px 0;
}

.profile-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid rgba(var(--primary-interaction-selected), 0.9);
}

.form-header .title {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800, #1B1F22);
  font-family: var(--font-family-Font-Family, Poppins);
  font-size: var(--font-size-2xl, 24px);
  font-style: normal;
  font-weight: var(--font-weight-bold, 700);
  line-height: 120%;
}

.save-container {
  position: absolute;
  right: 50px;
}
</style>
