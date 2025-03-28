<template>
    <b-dialog v-model="isEditing" :width="width" @update:model-value="changeExpanded" class="op">
      <div class="form-wrapper">
        <h1>Adicionar Usuário</h1>
          <div class="flex justify-between items-center gap-4 w-full">
            <BInput
              errorMessage="O nome precisa ter ao menos 3 caracteres  "
              :isError="false"
              :isTextArea="false"
              labelValue="Name"
              :required="false"
              size="base"
              textAlign="start"
              tooltipMinWidth="none"
              type="text"
            />
          </div>

          <div class="flex justify-between items-center gap-4 w-full">
            <BInput
              errorMessage="O email precisa ser válido"
              :isError="false"
              :isTextArea="false"
              labelValue="Name"
              :required="false"
              size="base"
              textAlign="start"
              tooltipMinWidth="none"
              type="email"
            />
          </div>
      </div>
    </b-dialog>
</template>
<script setup lang="ts">
const isEditing = true;
const width = 1000;

const changeExpanded = (v) => {
    console.log('changeeeee', v);
};

const editingItem = {
    name: 'fsdfsd'
}
</script>

<style>
.form-wrapper {
    padding: 50px;
    min-height: 500px;
}
</style>