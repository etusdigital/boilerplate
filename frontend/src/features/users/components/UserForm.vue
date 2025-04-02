<template>
  <b-dialog v-model="model" :width="width" class="op" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <h1>Adicionar Usuário</h1>
      <div class="flex items-start justify-between w-full gap-xs">
        <BInput
          v-model="editingUser.name"
          errorMessage="O nome precisa ter ao menos 3 caracteres"
          labelValue="Name"
          :required="true"
          size="base"
          type="text"
        />

        <BInput
          v-model="editingUser.email"
          errorMessage="O email precisa ser válido"
          :isError="false"
          :isTextArea="false"
          labelValue="Email"
          :required="true"
          size="base"
          type="email"
          :disabled="isEditing"
        />

        <img
          v-if="isEditing && editingUser.profileImage"
          :src="editingUser.profileImage"
          alt="Profile Image"
          class="profile-img"
        />
      </div>
      <div class="flex items-center justify-between w-full">
        <BInput
          v-model="editingUser.profileImage"
          errorMessage="A url da imagem não é válida"
          :isError="!isValidUrl"
          :isTextArea="false"
          labelValue="Profile Image"
          :required="true"
          size="base"
          type="text"
        />
      </div>
    </div>

    <div class="form-actions">
      <b-button color="danger" :disabled="false" :loading="false" size="medium" type="button" @click="closeForm">
        Cancelar
      </b-button>
      <b-button
        color="success"
        :disabled="false"
        :loading="false"
        size="medium"
        type="button"
        @click="emit('save', editingUser, isEditing)"
      >
        Salvar
      </b-button>
    </div>
  </b-dialog>
</template>

<script setup lang="ts">
import { ref, watch, inject, computed } from 'vue'
import type { User } from '@/features/users/types/user.type'
import { useMainStore } from '@/app/stores'

const width = 1000
const toast = inject('toast') as any
const mainStore = useMainStore()
const toastOptions = mainStore.toastOptions

const props = defineProps<{
  modelValue: boolean
  user: User
}>()

const model = defineModel<boolean>('modelValue')
const editingUser = ref({ ...props.user })

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

watch(
  () => props.modelValue,
  (value) => {
    model.value = value
  },
)

const updateModelValue = (value: boolean) => {
  model.value = value
  emit('update:modelValue', value)
}

const closeForm = () => {
  emit('close', isEditing.value ? props.user : null)
}
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
}
.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: auto;
  margin-right: 15px;
}
</style>
