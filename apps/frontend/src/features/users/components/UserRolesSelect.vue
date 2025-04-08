<template>
  <div>
    <h5>User Roles Select</h5>
    <div class="flex flex-col gap-2">
      <div v-for="(role, index) in userRoles" :key="role.accountId" class="flex flex-row gap-2">
        <div>
          <BSelect :absolute="true" v-model="role.accountName" :items="[...notUsedAccountNames, role.accountName]"
            :searchable="true" />
        </div>
        <div class="flex flex-row gap-2 justify-center items-center">
          <b-icon name="arrows_outward" class="text-gray-500" />
        </div>
        <div>
          <BSelect :absolute="true" v-model="role.role" :items="roleOptions" :searchable="true" />
        </div>
        <div class="flex flex-row gap-2 justify-center items-center cursor-pointer" @click="removeRole(index)">
          <b-icon name="delete" class="text-gray-500" />
        </div>
      </div>
    </div>
    <div v-if="notUsedAccounts.length > 0" class="user-roles-add flex flex-row gap-2 items-center cursor-pointer"
      @click="addRole">
      <b-icon name="add" />
      Add Role
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
  }
});

const emit = defineEmits(['update:modelValue']);

const userRoles = ref([...props.roles]);
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
  emit('update:modelValue', userRoles.value);
}, { deep: true });
</script>

<style>
.user-roles-add {
  margin: 20px 0;
}

.text-gray-500 {
  color: #6b7280;
}
</style>