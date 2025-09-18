<template>
  <Transition name="page" mode="out-in">
    <div class="main-container">
      <!-- TitleBar com título e botão de ação -->
      <TitleBar :title="t('accounts.accounts')" :actions="titleBarActions" />
      <!-- início b-table usada para listar os usuários -->
      <Table
        :columns="tcolumns"
        :items="data"
        :sort-options="{ by: 'name', desc: false }"
        :loading="isLoading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
      >
        <template v-for="(metric, index) in tcolumns" :key="index" v-slot:[metric.value]="{ item }">
          <td v-if="item && metric.value" :key="`child-${index}-${item.value}`">
            <template v-if="metric.value === 'updatedAt'">
              <span class="w-full text-left">{{ formatDisplayDate(item.updatedAt) }}</span>
              <br />
              <span v-if="item?.updatedAt && item?.createdAt" class="text-xxs w-full text-center"
                >{{ t('btable.createdAt') }} {{ formatDisplayDate(item.createdAt) }}</span
              >
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
            <div class="flex justify-center gap-sm">
              <Button icon="edit" color="neutral" round @click="onEdit(item, index)" />
              <Button icon="delete" color="danger" round @click="onDelete(item)" />
            </div>
          </td>
        </template>
        <template #items-per-page>{{ t('btable.itemsPerPage') }}</template>
        <template #showing-page="{ min, max, total }">
          {{ t('btable.showingNofN', [min, max, total]) }}
        </template>
      </Table>
      <!-- fim b-table -->
      <AccountForm
        v-if="showFormControl"
        v-model="showForm"
        :account="editingAccount"
        @save="onSave"
        @close="onCloseForm"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, inject } from 'vue'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import type { Account } from '@/features/accounts/types/account.type'
import type { TitleBarAction } from '@/shared/components/TitleBar.vue'
import AccountForm from '@/features/accounts/components/AccountForm.vue'
import TitleBar from '@/shared/components/TitleBar.vue'

const confirm = inject('confirm') as Function
const t = inject('t') as Function
const { getAllAccounts, saveAccount, deleteAccount } = useAccounts()

const isLoading = ref(true)
const itemsPerPage = ref(10)
const page = ref(1)
const tcolumns = ref([
  {
    label: t('btable.name'),
    value: 'name',
    sortable: true,
    width: '50%',
  },
  {
    label: t('btable.description'),
    value: 'description',
    sortable: true,
  },
  {
    label: t('btable.updatedAt'),
    value: 'updatedAt',
    sortable: true,
  },
  {
    label: t('btable.deletedAt'),
    value: 'deletedAt',
    sortable: true,
  },
])

const data = ref<Array<Account>>([])
const editingAccount = ref<Account>({} as Account)
const editingIndex = ref(0)
const showFormControl = ref(false)

const showForm = ref(false)

const titleBarActions = computed<TitleBarAction[]>(() => [
  {
    key: 'add-account',
    text: t('accounts.addAccount'),
    icon: 'add_circle',
    color: 'primary',
    onClick: createAccount,
  },
])

onMounted(async () => {
  await fetchAccounts()
})

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

const onEdit = (val: Account, index: number): void => {
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
  data.value = await getAllAccounts()
  editingAccount.value = {} as Account
  isLoading.value = false
}

const onSave = async (editingAccount: Account, isEditing: boolean): Promise<void> => {
  await saveAccount(editingAccount, isEditing)
  await fetchAccounts()
}

const onDelete = async (val: Account): Promise<void> => {
  const result = await confirm({
    title: t('deleteAccount'),
    message: `${t('deleteAccountConfirm')}: ${val.name}?`,
    acceptLabel: t('delete'),
    cancelLabel: t('cancel'),
  })

  if (!result) return

  await deleteAccount(val)
  await fetchAccounts()
}

const onCloseForm = (account: Account): void => {
  if (data.value && data.value[editingIndex.value]) {
    data.value[editingIndex.value] = account
  }
  editingAccount.value = {} as Account
  showForm.value = false
  forceResetForm()
}
</script>

<style>
@reference "@/app/assets/main.css";

.main-container {
  @apply p-lg;
}
</style>
