<template>
  <b-sidebar v-model="model" :noOutsideClose="true" width="40%" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <div class="form-header flex flex-row items-center gap-4">
        <BIcon name="close" @click="closeForm" class="cursor-pointer" />
        <div class="title">{{ isEditing ? 'Edit Usuer' : 'Invite User' }}</div>
        <div class="save-container">
          <b-button color="success" :disabled="false" :loading="false" size="medium" type="button"
            @click="emit('save', editingUserBind, isEditing)">
            {{ isEditing ? 'Save' : 'Send Invite' }}
          </b-button>
        </div>
      </div>
      <div class="form-content">
        <div class="profile-img-wrapper">
          <img
            :src="!!editingUser.profileImage ? editingUser.profileImage : 'https://stbbankstown.syd.catholic.edu.au/wp-content/uploads/sites/130/2019/05/Person-icon.jpg'"
            alt="Profile Image" class="profile-img" />
        </div>
        <div class="flex flex-col items-start justify-between w-full gap-xl">
          <BInput v-model="editingUser.name" errorMessage="O nome precisa ter ao menos 3 caracteres" labelValue="Name"
            :required="true" size="base" type="text" />

          <BInput v-model="editingUser.email" errorMessage="O email precisa ser válido" :isError="false"
            :isTextArea="false" labelValue="Email" :required="true" size="base" type="email" :disabled="isEditing" />

          <BInput v-if="isSameUser" v-model="editingUser.profileImage" errorMessage="A url da imagem não é válida"
            :isError="!isValidUrl" :isTextArea="false" labelValue="Profile Image" :required="true" size="base"
            type="text" />

          <UserRolesSelect :roles="parsedPermissions" :allAccounts="allAccountsParsed" :allowSuperAdmin="true"
            @roles-updated="updateSelectedPermissions" />

        </div>
      </div>
    </div>

    <div class="form-actions">
    </div>
  </b-sidebar>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { User } from '@/features/users/types/user.type'
import type { Account } from '@/features/accounts/types/account.type'
import type { Role } from './UserRolesSelect.vue'
import { ref, watch, computed } from 'vue';
import { useMainStore } from '@/app/stores'
import UserRolesSelect from './UserRolesSelect.vue'

const props = defineProps<{
  modelValue: boolean
  user: User
  allAccounts: Array<Account>
}>()

const mainStore = useMainStore()

const isSameUser = computed(() => props.user.id === mainStore.user?.id);
const model = defineModel<boolean>('modelValue')
const editingUser = ref({ ...props.user })
const allAccountsParsed = ref([...props.allAccounts])
allAccountsParsed.value = allAccountsParsed.value.map((account) => ({
  ...account,
}));

const parsedPermissions: Ref<string[]> = ref([]);

const getParsedRole = (role: string) => {
  const lowerCaseRole = role.toLowerCase();
  return (lowerCaseRole.charAt(0).toUpperCase() + lowerCaseRole.slice(1)) as 'Reader' | 'Writer' | 'Admin';
}

parsedPermissions.value = editingUser.value.userAccounts.map((acc) => ({
  accountId: acc.accountId,
  role: getParsedRole(acc.role) || 'Reader',
  accountName: acc.account.name,
} as Role));

const emit = defineEmits<{
  (e: 'save', user: User, isEditing: boolean): void
  (e: 'close', user?: User | null): void
  (e: 'update:modelValue', value: boolean): void
}>()

const isEditing = ref(!!props.user.id)

const isValidUrl = computed(() => {
  try {
    new URL(editingUser.value.profileImage || '')
    return true
  } catch (error) {
    return false
  }
})

const editedUserAccounts = ref([]);

const editingUserBind = computed(() => ({
  ...editingUser.value,
  userAccounts: editedUserAccounts.value
}))

const updateSelectedPermissions = (value: any[]) => {
  editedUserAccounts.value = value.map(p => ({ ...p, role: p.role.toLowerCase() as 'reader' | 'writer' | 'admin' }));
}

const updateModelValue = (value: boolean) => {
  model.value = value
  emit('update:modelValue', value)
}

const closeForm = () => {
  emit('close', isEditing.value ? props.user : null)
}

watch(
  () => props.modelValue,
  (value) => {
    model.value = value
  },
)
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
