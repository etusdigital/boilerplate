<template>
    <b-dialog v-model="isEditing" :width="width" class="op">
      <div class="form-wrapper">
        <h1>Adicionar Usuário</h1>
          <div class="flex justify-between items-center w-full form-container">
            <BInput
              v-model="user.name"
              errorMessage="O nome precisa ter ao menos 3 caracteres"
              labelValue="Name"
              :required="true"
              size="base"
              type="text"
            />

            <BInput
              v-model="user.email"
              errorMessage="O email precisa ser válido"
              :isError="false"
              :isTextArea="false"
              labelValue="Email"
              :required="true"
              size="base"
              type="email"
            />
        </div>
        <div class="flex justify-between items-center w-full form-container">
            <BInput
              v-model="user.profileImage"
              errorMessage="O nome precisa ter ao menos 3 caracteres"
              :isError="!isValidUrl"
              labelValue="Profile Image"
              size="base"
              type="text"
            />
          </div>
      </div>

      <div class="form-actions"><b-button
            color="warning"
            :disabled="false"
            :loading="false"
            size="medium"
            type="button"
        >
            Cancel
        </b-button>
        <b-button
            color="info"
            :disabled="false"
            :loading="false"
            size="medium"
            type="button"
        >
            Save
        </b-button>
      </div>
    </b-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

const isEditing = true;
const width = 1000;

const editingItem = {
    name: 'fsdfsd'
};

const isValidUrl = ref(false);

const user = ref({
    name: '',
    email: '',
    profileImage: ''
});

// Watch para monitorar mudanças em user.value.profileImage
watch(
  () => user.value.profileImage,
  (newValue) => {
    console.log('afafa', newValue);
    try {
      new URL(newValue); // Tenta criar um novo URL
      isValidUrl.value = true; // Se não houver erro, a URL é válida
    } catch (error) {
      isValidUrl.value = false; // Se houver erro, a URL é inválida
    }
  }
);
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
</style>