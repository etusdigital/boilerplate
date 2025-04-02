<template>
  <Transition name="page" mode="out-in">
    <div class="main-container">
      <h1 class="core-app-title">Users</h1>
      <!-- início b-round-button usado para adicionar um novo usuário -->
        <template v-if="true" >
            <b-round-button text="Adicionar Usuário" @click="createUser" />
        </template>
        <!-- fim b-round-button -->
        <!-- início b-table usada para listar os usuários -->
        <b-table
          :headers="tcolumns"
          :items="tdata"
          :options="{'sortBy': 'name', 'sortDesc': false}"
          :loading="isLoading"
          :itemsPerPage="itemsPerPage"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template
            v-for="(metric, index) in tcolumns"
            v-slot:[metric.value]="{ item }"
          >
            <td
                v-if="item && metric.value"
                :key="`child-${index}-${item.value}`"
            >
            {{ item[metric.value] }}
            </td>
          </template>
          <template v-slot:actions="{ item, index }">
            <td>
              <div class="flex justify-center gap-4">
                <b-icon name="edit" class="table-action edit" @click="onEdit(item, index)" />
                <b-icon name="delete" class="table-action delete" @click="onDelete(item)" />
              </div>
            </td>
          </template>
          <template #items-per-page>Items per page</template>
          <template #showing-page="{ min, max, total }">
            {{ `Showing ${min} to ${max} of ${total}` }}
          </template>
        </b-table>
        <!-- fim b-table -->
        <UserForm v-if="showForm" v-model="showForm" :user="editingUser" @save="onSave" @close="onCloseForm" />
        <!-- início b-dialog usado para deletar o usuário e controlado por flags como: showDelete e closeDelete -->
        <b-dialog v-model="showDelete" :width="1000" class="op">
          <div class="form-wrapper">
            <h1>Deletar Usuário</h1>
            <p class="text-danger">Tem certeza que deseja deletar o usuário: <b>{{ deletingUser.email }}</b>?</p>
            <p class="text-danger">Esta ação é irreversível.</p>
            <div class="form-actions">
              <div class="flex justify-between items-center w-full form-container">
                <b-button
                  color="primary"
                  :disabled="false"
                  :loading="false"
                  size="medium"
                  type="button"
                  @click="closeDelete"
                >
                  Cancelar
                </b-button>
                <b-button
                    color="danger"
                    :disabled="false"
                    size="medium"
                    type="submit"
                    @click="deleteUser(deletingUser)"
                >
                    Deletar
                </b-button>
              </div>
            </div>
          </div>
        </b-dialog>
        <!-- fim b-dialog -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, inject } from 'vue';
  import UserForm from '@/components/UserForm.vue';
  import axios from 'axios';
  import type { User } from '@/types';
  import { useMainStore } from '@/stores/main'

  const mainStore = useMainStore();
  const toastOptions = mainStore.toastOptions;

  const toast = inject('toast') as any;

  const isLoading = ref(true);
  const itemsPerPage = ref(100);
  const page = ref(1);
  const tcolumns = ref([
    {
        "text": "Name",
        "label": "Name",
        "value": "name",
        "sortable": true,
        "width": "50%"
    },
    {
        "text": "Email",
        "label": "Email",
        "value": "email",
        "sortable": true,
    },
    {
        "text": "Join Date",
        "label": "Join Date",
        "value": "created_at",
        "sortable": true,
    },
    {
        "text": "End Date",
        "label": "End Date",
        "value": "deleted_at",
        "sortable": true,
    }
]);

const tdata = ref<Array<User>>([]);
const editingUser = ref<User>({} as User);
const deletingUser = ref({} as any);
const editingIndex = ref(0);

const showForm = computed(() => {
  return !isLoading.value && !!tdata.value.length && !!Object.keys(editingUser.value).length;
}); 

const fetchUsers = async () => {
  isLoading.value = true;
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/users`, 
    {
      headers: {
        'account-id': 1,
        'user': JSON.stringify(mainStore.user)
      }
    }
  );
  tdata.value = response.data;
  editingUser.value = {} as User;
  isLoading.value = false;
}

const deleteUser = async (val: any) => {
  deletingUser.value = val;
  showDelete.value = true;

  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${val.id}`, {
    headers: {
      'account-id': 1,
      'user': JSON.stringify(mainStore.user)
    }
  });

  toast({
        message: `Usuário: ${deletingUser.value.email} deletado com sucesso`,
        ...toastOptions,
        ...{type: 'success' }  
    });

  closeDelete();
  fetchUsers();
}

const createUser = () => {
  editingUser.value = {
    name: '',
    email: '',
  } as User;
  editingIndex.value = 0;
}

const showDelete = ref(false);

const onEdit = (val: any, index: number) => {
  editingUser.value = val;
  editingIndex.value = index;
}

const onSave = (val: any) => {
  fetchUsers();
}

const closeDelete = () => {
  showDelete.value = false;
  deletingUser.value = {};
}

const onDelete = async (val: any) => {
  deletingUser.value = val;
  showDelete.value = true;
}

const onCloseForm = (data: any ) => {
  if (data && tdata.value[editingIndex.value]) {
    tdata.value[editingIndex.value] = data;
  }
  editingUser.value = {} as User;
}

onMounted(() => {
  fetchUsers();
});
</script>

<style>
.form-card {
  padding: 2rem;
}
p.text-danger {
  margin-bottom: .75rem;
}
</style>