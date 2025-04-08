<template>
  <div class="main-container">
    <h1 class="core-app-title">Users</h1>
    <!-- início b-round-button usado para adicionar um novo usuário -->
    <b-round-button text="Adicionar Usuário" @click="createUser" />
    <!-- fim b-round-button -->
    <!-- início b-table usada para listar os usuários -->
    <b-table :headers="tcolumns" :items="tdata" :options="{ sortBy: 'name', sortDesc: false }" :loading="isLoading"
      :itemsPerPage="itemsPerPage" v-model:page="page" v-model:items-per-page="itemsPerPage">
      <template v-for="(metric, index) in tcolumns" v-slot:[metric.value]="{ item }">
        <td v-if="item && metric.value" :key="`child-${index}-${item.value}`">
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
    <UserForm v-if="showFormControl" v-model="showForm" :user="editingUser" :allAccounts="allAccounts" @save="onSave"
      @close="onCloseForm" />
    <!-- início b-dialog usado para deletar o usuário e controlado por flags como: showDelete e closeDelete -->
    <b-dialog v-model="showDelete" :width="1000" class="op">
      <div class="form-wrapper">
        <h1>Deletar Usuário</h1>
        <p class="text-danger">
          Tem certeza que deseja deletar o usuário: <b>{{ deletingUser.email }}</b>?
        </p>
        <p class="text-danger">Esta ação é irreversível.</p>
        <div class="delete-form-actions">
          <div class="flex items-center justify-between w-full form-container">
            <b-button color="primary" :disabled="false" :loading="false" size="medium" type="button"
              @click="closeDelete">
              Cancelar
            </b-button>
            <b-button color="danger" :disabled="false" size="medium" type="submit" @click="onDeleteUser(deletingUser)">
              Deletar
            </b-button>
          </div>
        </div>
      </div>
    </b-dialog>
    <!-- fim b-dialog -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import UserForm from '@/features/users/components/UserForm.vue'
import type { User } from '@/features/users/types/user.type'
import { useUsers } from '@/features/users/composables/useUsers'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import type { Account } from '@/features/accounts/types/account.type'
const isLoading = ref(true)
const itemsPerPage = ref(100)
const page = ref(1)
const tcolumns = ref([
  {
    text: 'Name',
    label: 'Name',
    value: 'name',
    sortable: true,
    width: '50%',
  },
  {
    text: 'Email',
    label: 'Email',
    value: 'email',
    sortable: true,
  },
  {
    text: 'Join Date',
    label: 'Join Date',
    value: 'createdAt',
    sortable: true,
  },
  {
    text: 'End Date',
    label: 'End Date',
    value: 'deletedAt',
    sortable: true,
  },
])

const tdata = ref<Array<User>>([])
const allAccounts = ref<Array<Account>>([])
const editingUser = ref<User>({} as User)
const deletingUser = ref({} as any)
const editingIndex = ref(0)
const { getAllUsers, saveUser, deleteUser } = useUsers()
const { getAllAccounts } = useAccounts()

const showForm = ref(false)
const showDelete = ref(false)
const showFormControl = ref(false)

const onEdit = async (val: any, index: number) => {
  showFormControl.value = false
  editingUser.value = val
  editingIndex.value = index
  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })
}

const onDeleteUser = async (val: any) => {
  await deleteUser(val)
  closeDelete()
  fetchUsers()
}

const createUser = () => {
  editingUser.value = {
    name: '',
    email: '',
    profileImage: '',
  } as User
  editingIndex.value = 0

  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })
}

const forceResetForm = () => {
  setTimeout(() => {
    showFormControl.value = false
  }, 500)
}

const fetchUsers = async () => {
  isLoading.value = true
  showForm.value = false
  forceResetForm()
  tdata.value = await getAllUsers()
  const accounts = await getAllAccounts()
  allAccounts.value = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }))
  console.log('allAccounts', allAccounts)
  editingUser.value = {} as User
  isLoading.value = false
}

const onSave = async (editingUser: any, isEditing: boolean) => {
  console.log('onSave', editingUser, isEditing)
  await saveUser(editingUser, isEditing)
  fetchUsers()
}

const closeDelete = () => {
  showDelete.value = false
  deletingUser.value = {}
}

const onDelete = async (val: any) => {
  deletingUser.value = val
  showDelete.value = true
}

const onCloseForm = (data: any) => {
  if (data && tdata.value[editingIndex.value]) {
    tdata.value[editingIndex.value] = data
  }
  editingUser.value = {} as User
  showForm.value = false
  forceResetForm()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style>
.form-card {
  padding: 2rem;
}

p.text-danger {
  margin-bottom: 0.75rem;
}
</style>
