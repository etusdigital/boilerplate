<template>
  <Transition name="page" mode="out-in">
    <div class="main-container">
      <TitleBar :title="t('accounts.accounts')" :actions="titleBarActions" />
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
      <AccountForm v-if="showFormControl" v-model="showForm" :account="editingAccount" @save="onSave"
        @close="onCloseForm" />
      <!-- início b-dialog usado para deletar o usuário e controlado por flags como: showDelete e closeDelete -->
      <b-dialog v-model="showDelete" :width="1000" class="op">
        <div class="form-wrapper">
          <h1>Delete Account</h1>
          <p class="text-danger">
            Are you sure you want to delete the account: <b>{{ deletingAccount.name }}</b>?
          </p>
          <p class="text-danger">This action is irreversible.</p>
          <div class="delete-form-actions">
            <div class="flex items-center justify-between w-full ">
              <b-button color="primary" @click="closeDelete">Cancelar</b-button>
              <b-button color="danger" @click="onDeleteAccount(deletingAccount)">Deletar</b-button>
            </div>
          </div>
        </div>
      </b-dialog>
      <!-- fim b-dialog -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import AccountForm from '@/features/accounts/components/AccountForm.vue'
import type { Account } from '@/features/accounts/types/account.type'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import TitleBar from '@/shared/components/TitleBar.vue'
import type { TitleBarAction } from '@/shared/components/TitleBar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(true)
const itemsPerPage = ref(100)
const page = ref(1)
const tcolumns = ref([
  {
    text: t('btable.name'),
    label: t('btable.name'),
    value: 'name',
    sortable: true,
    width: '50%',
  },
  {
    text: t('btable.description'),
    label: t('btable.description'),
    value: 'description',
    sortable: true,
  },
  {
    text: t('btable.createdAt'),
    label: t('btable.createdAt'),
    value: 'createdAt',
    sortable: true,
  },
  {
    text: t('btable.deletedAt'),
    label: t('btable.deletedAt'),
    value: 'deletedAt',
    sortable: true,
  },
])

const tdata = ref<Array<Account>>([])
const editingAccount = ref<Account>({} as Account)
const deletingAccount = ref({} as any)
const editingIndex = ref(0)
const showFormControl = ref(false)
const { getAllAccounts, saveAccount, deleteAccount } = useAccounts()

const showForm = ref(false)

const titleBarActions = computed<TitleBarAction[]>(() => [
  {
    key: 'add-account',
    text: t('accounts.addAccount'),
    icon: 'add_circle',
    color: 'primary',
    onClick: createAccount
  }
])

const onDeleteAccount = async (val: any): Promise<void> => {
  await deleteAccount(val)
  closeDelete()
  fetchAccounts()
}

const createAccount = (): void => {
  editingAccount.value = {
    name: '',
    description: '',
    domain: '',
  } as Account
  editingIndex.value = 0

  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })
}

const showDelete = ref(false)

const onEdit = (val: any, index: number): void => {
  showFormControl.value = false
  editingAccount.value = val
  editingIndex.value = index
  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })
}

const forceResetForm = (): void => {
  setTimeout(() => {
    showFormControl.value = false
  }, 500)
}

const fetchAccounts = async (): Promise<void> => {
  isLoading.value = true
  showForm.value = false
  forceResetForm()
  tdata.value = await getAllAccounts()
  editingAccount.value = {} as Account
  isLoading.value = false
}

const onSave = async (editingAccount: any, isEditing: boolean): Promise<void> => {
  await saveAccount(editingAccount, isEditing)
  fetchAccounts()
}

const closeDelete = (): void => {
  showDelete.value = false
  deletingAccount.value = {}
}

const onDelete = (val: any): void => {
  deletingAccount.value = val
  showDelete.value = true
}

const onCloseForm = (data: any): void => {
  if (data && tdata.value[editingIndex.value]) {
    tdata.value[editingIndex.value] = data
  }
  editingAccount.value = {} as Account
  showForm.value = false
  forceResetForm()
}

onMounted(() => {
  fetchAccounts()
})
</script>

<style>
.main-container {
  padding: 20px;
}

.delete-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  bottom: 0;
  width: calc(100% - 60px);
  margin: 30px;
}
</style>