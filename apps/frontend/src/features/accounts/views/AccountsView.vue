<template>
  <Transition name="page" mode="out-in">
    <div class="main-container">
      <!-- TitleBar com título e botão de ação -->
      <TitleBar :title="t('accounts.accounts')" :actions="titleBarActions" />
      <!-- início b-table usada para listar os usuários -->
      <b-table :headers="tcolumns" :items="tdata" :options="{ sortBy: 'name', sortDesc: false }" :loading="isLoading"
        v-model:page="page" v-model:items-per-page="itemsPerPage">
        <template v-for="(metric, index) in tcolumns" v-slot:[metric.value]="{ item }">
          <td v-if="item && metric.value" :key="`child-${index}-${item.value}`">
            <template v-if="metric.value === 'updatedAt'">
              <span class="w-full text-left">{{ formatDisplayDate(item.updatedAt) }}</span>
              <br />
              <span v-if="item?.updatedAt && item?.createdAt" class="text-xxs w-full text-center">{{
                t('btable.createdAt') }} {{ formatDisplayDate(item.createdAt) }}</span>
            </template>
            <template v-else-if="metric.value === 'deletedAt'">
              <span class="w-full text-left">{{ formatDisplayDate(item.deletedAt) }}</span>
            </template>
            <template v-else>
              {{ item[metric.value] }}
            </template>
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
        <template #items-per-page>{{ t('btable.itemsPerPage') }}</template>
        <template #showing-page="{ min, max, total }">
          {{ t('btable.showingNofN', [min, max, total]) }}
        </template>
      </b-table>
      <!-- fim b-table -->
      <AccountForm v-if="showFormControl" v-model="showForm" :account="editingAccount" @save="onSave"
        @close="onCloseForm" />
      <!-- início b-dialog usado para deletar o usuário e controlado por flags como: showDelete e closeDelete -->
      <b-dialog v-model="showDelete" :width="1000" class="op">
        <div class="form-wrapper">
          <h1>{{ t('deleteAccount') }}</h1>
          <p class="text-danger">
            {{ t('accountsPage.messages.deleteConfirm') }}: <b>{{ deletingAccount.name }}</b>?
          </p>
          <p class="text-danger">{{ t('messages.actionIrreversible') }}.</p>
          <div class="delete-form-actions">
            <div class="flex items-center justify-between w-full ">
              <b-button color="primary" @click="closeDelete">{{ t('cancel') }}</b-button>
              <b-button color="danger" @click="onDeleteAccount(deletingAccount)">{{ t('delete') }}</b-button>
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
import { useI18n } from 'vue-i18n'
import TitleBar from '@/shared/components/TitleBar.vue'
import type { TitleBarAction } from '@/shared/components/TitleBar.vue'
const { t } = useI18n()

const isLoading = ref(true)
const itemsPerPage = ref(10)
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
    text: t('btable.updatedAt'),
    label: t('btable.updatedAt'),
    value: 'updatedAt',
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

const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (e) {
    return '-' // Retorna '-' em caso de erro na conversão
  }
}

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
