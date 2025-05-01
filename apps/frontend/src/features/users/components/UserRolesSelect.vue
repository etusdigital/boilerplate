<template>
  <div class="user-roles-container">
    <h3 class="user-roles-title">{{ $t('users.roles_and_permissions') }}</h3>
    <div class="super-admin-selector flex flex-row gap-2 items-center">
      <BCheckbox :allowIndeterminate="false" :disabled="false" v-model="isSuperAdmin" :rhs="false" />
      <h5>{{ $t('users.is_super_admin') }}</h5>
    </div>
    <div class="flex flex-col gap-2">
      <h5 class="roles-selector-label">{{ $t('users.user_permissions_per_account') }}</h5>
      <div v-for="(role, index) in userRoles" :key="role.accountId" class="flex flex-row gap-2">
        <div>
          <BSelect :absolute="true" v-model="role.accountName" :items="[...notUsedAccountNames, role.accountName]"
            :searchable="true" />
        </div>
        <div class="flex flex-row gap-2 justify-center items-center">
          <b-icon name="arrows_outward" class="text-gray-500" />
        </div>
        <div>
          <BSelect :absolute="true" v-model="role.role" :items="roleOptions" />
        </div>
        <div class="flex flex-row gap-2 justify-center items-center cursor-pointer" @click="removeRole(index)">
          <b-icon name="delete" class="text-gray-500" />
        </div>
      </div>
    </div>
    <div v-if="notUsedAccounts.length > 0" class="user-roles-add flex flex-row gap-2 items-center cursor-pointer"
      @click="addRole">
      <b-icon name="add" />
      {{ $t('users.add_role') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account } from '@/features/accounts/types/account.type';
import { ref, computed, watch } from 'vue';

export interface Role {
  accountId: string;
  role: string;
  accountName: string;
}

const props = defineProps({
  allAccounts: {
    type: Array<Account>,
    default: []
  },
  allowSuperAdmin: {
    type: Boolean,
    default: false
  },
  roles: {
    type: Array<Role>,
    default: []
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['roles-updated', 'change-super-admin']);

const userRoles = ref([...props.roles]);

const isSuperAdmin = ref(props.isSuperAdmin);
const roleOptions = [
  'Reader',
  'Writer',
  'Admin',
];

const notUsedAccounts = computed(() => {
  return props.allAccounts.filter((acc) => {
    return !userRoles.value.some((role) => role.accountName === acc.label);
  });
});

const notUsedAccountNames = computed(() => {
  return notUsedAccounts.value.map((acc) => acc.label);
});

const addRole = () => {
  if (notUsedAccounts.value.length === 0) {
    return;
  }

  const destruc = { ...notUsedAccounts.value[0] };
  userRoles.value.push({
    accountId: destruc.value,
    role: 'Reader',
    accountName: destruc.label,
  });
};

const removeRole = (index: number) => {
  userRoles.value.splice(index, 1);
};

watch(userRoles, () => {
  emit('roles-updated', userRoles.value);
}, { deep: true });

watch(isSuperAdmin, () => {
  emit('change-super-admin', isSuperAdmin.value);
});
</script>

<style>
.user-roles-container {
  padding: 20px 0;
}

.user-roles-add {
  margin: 20px 0;
}

.text-gray-500 {
  color: #6b7280;
}

.super-admin-selector {
  margin: 20px 0;
}

.roles-selector-label {
  margin-bottom: 5px;
}

.user-roles-title {
  margin: 15px 0;
}
</style>