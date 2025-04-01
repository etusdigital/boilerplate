<template>
  <Transition name="fade">
    <b-dialog v-model="show" :width="width" class="op">
      <div class="form-wrapper">
        <h1>Adicionar Usuário</h1>
          <div class="flex justify-between items-center w-full form-container">
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

            <img v-if="isEditing && editingUser.profileImage" :src="editingUser.profileImage" alt="Profile Image" class="profile-img">
        </div>
        <div class="flex justify-between items-center w-full form-container">
          <!-- TODO: Corrigir o estilo dos inputs -->
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
        <b-button
            color="danger"
            :disabled="false"
            :loading="false"
            size="medium"
            type="button"
            @click="closeForm"
        >
            Cancelar
        </b-button>
        <b-button
            color="success"
            :disabled="false"
            :loading="false"
            size="medium"
            type="button"
            @click="saveUser"
        >
            Salvar
        </b-button>
      </div>
    </b-dialog>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, inject, computed } from 'vue';
import axios from 'axios';
import type { User } from '@/types';

const width = 1000;
const toast = inject('toast') as any;
const show = ref(true);

const props = defineProps<{
  user: User
}>();

const editingUser = ref({...props.user});

const emit = defineEmits<{
  (e: 'save', user: User): void;
  (e: 'close', user?: User | null): void;
}>();

const isEditing = ref(!!props.user.id);

const isValidUrl = computed(() => {
  try {
    new URL(editingUser.value.profileImage || '');
    return true;
  } catch (error) {
    return false;
  }
});

const toastOptions =  {
  timeout: 3500,
  type: 'error',
  top: true,
  right: true,
};

const saveUser = async () => {
  const method = isEditing.value ? axios.put : axios.post;
  const saveUrl = isEditing.value ? `${import.meta.env.VITE_BACKEND_URL}/users/${editingUser.value.id}` : `${import.meta.env.VITE_BACKEND_URL}/users`;
  try {
    const response = await method(saveUrl, { ...editingUser.value }, {
      //TODO: Injetar no header dados provenientes da store, para pegar os dados do usuário logado
      headers: {
        'account-id': 1,
        'user': JSON.stringify({ "id": 1 })
      }
    });

    emit( 'save', editingUser.value );

    toast({
        message: `Usuário: ${editingUser.value.email} salvo com sucesso`,
        ...toastOptions,
        ...{type: 'success' }
    });
  } catch (error: any) {

    toast({
        message: `Erro ao salvar usuário: ${error.response.data.message}`,
        ...toastOptions
    });
  }
}

const closeForm = () => {
  emit('close', isEditing.value ? props.user : null);
}
</script>

<style>
.form-wrapper {
    padding: 50px;
}

.form-container {
    gap: 1rem;
}
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 50px;
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