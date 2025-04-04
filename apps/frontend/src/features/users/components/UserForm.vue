<template>
  <b-sidebar v-model="model" :noOutsideClose="true" width="40%" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <h1>Adicionar Usuário</h1>

      <img
        :src="!!editingUser.profileImage ? editingUser.profileImage : 'https://stbbankstown.syd.catholic.edu.au/wp-content/uploads/sites/130/2019/05/Person-icon.jpg'"
        alt="Profile Image" class="profile-img" />

      <div class="flex flex-col items-start justify-between w-full gap-xl">
        <BInput v-model="editingUser.name" errorMessage="O nome precisa ter ao menos 3 caracteres" labelValue="Name"
          :required="true" size="base" type="text" />

        <BInput v-model="editingUser.email" errorMessage="O email precisa ser válido" :isError="false"
          :isTextArea="false" labelValue="Email" :required="true" size="base" type="email" :disabled="isEditing" />

        <BInput v-model="editingUser.profileImage" errorMessage="A url da imagem não é válida" :isError="!isValidUrl"
          :isTextArea="false" labelValue="Profile Image" :required="true" size="base" type="text" />

        <BMultiSelect :absolute="true" labelValue="Accounts" v-model="allAccountsParsed" :searchable="true"
          @update:model-value="updateSelectedAccounts" />
      </div>
    </div>

    <div class="form-actions">
      <b-button color="danger" :disabled="false" :loading="false" size="medium" type="button" @click="closeForm">
        Cancelar
      </b-button>
      <b-button color="success" :disabled="false" :loading="false" size="medium" type="button"
        @click="emit('save', editingUserBind, isEditing)">
        Salvar
      </b-button>
    </div>
  </b-sidebar>
</template>

<script setup lang="ts">
import { ref, watch, inject, computed, onMounted } from 'vue'
import type { User } from '@/features/users/types/user.type'
import type { Account } from '@/features/accounts/types/account.type'
import { useMainStore } from '@/app/stores'
const mainStore = useMainStore()
const toastOptions = mainStore.toastOptions

const props = defineProps<{
  modelValue: boolean
  user: User
  allAccounts: Array<Account>
}>()

const model = defineModel<boolean>('modelValue')
const editingUser = ref({ ...props.user })
const allAccountsParsed = ref([...props.allAccounts])
allAccountsParsed.value = allAccountsParsed.value.map((account) => ({
  ...account,
  selected: editingUser.value.userAccounts?.some(ac => {
    console.log('ac', ac.account.id === account.value, ac.account.id, account.value)
    return ac.account.id === account.value;
  }) || false
}))

console.log('allAccountsParsed', allAccountsParsed.value)

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

const editingUserBind = computed(() => ({
  ...editingUser.value,
  userAccounts: allAccountsParsed.value.filter(ac => ac.selected).map(ac => { return { "accountId": ac.value } })
}))

watch(
  () => props.modelValue,
  (value) => {
    model.value = value
  },
)

const updateModelValue = (value: boolean) => {
  console.log('updateModelValue', value)
  model.value = value
  emit('update:modelValue', value)
}

const closeForm = () => {
  emit('close', isEditing.value ? props.user : null)
}

const updateSelectedAccounts = (value: any) => {
  allAccountsParsed.value = value
}

onMounted(() => {
  console.log('onMounted', 'sfdsdf')
})
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

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: auto;
  margin-right: 15px;
  border: 1px solid rgba(var(--primary-interaction-selected), 0.9);
}
</style>
