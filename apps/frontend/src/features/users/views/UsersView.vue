<template>
  <div class="main-container">
    <!-- TitleBar com título e botão de ação -->
    <TitleBar :title="t('users')" :actions="titleBarActions" />

    <!-- Campo de busca -->
    <div class="flex gap-base w-[100%] justify-between items-center mb-base">
      <Input v-model="searchQuery" type="search" :placeholder="t('search')" @input="handleSearchChange" />
    </div>

    <!-- Tabela de usuários -->
    <b-table
      :columns="tcolumns"
      :items="users"
      :sort-options="{ by: 'name', desc: false }"
      :loading="isLoading"
      :items-per-page="itemsPerPage"
      :page="paginationMeta.currentPage"
      :number-of-items="paginationMeta.totalItems"
      render-pagination-in-back-end
      @sort-by="handleSortBy"
      @update:page="handlePageChange"
      @update:items-per-page="handleItemsPerPageChange"
    >
      <template v-for="(metric, index) in tcolumns" v-slot:[metric.value]="{ item }">
        <td v-if="item && metric.value" :key="`child-${index}-${item.value}`">
          <template v-if="metric.value === 'updatedAt'">
            <span class="w-full text-left">{{ formatDisplayDate(item.updatedAt) }}</span>
            <br />
            <span v-if="item?.updatedAt && item?.createdAt" class="text-xxs w-full text-center"
              >{{ t('createdAt') }} {{ formatDisplayDate(item.createdAt) }}</span
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

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-xl">
          <p v-if="paginationMeta.totalItems === 0" class="text-neutral-foreground-low">
            {{ t('messages.noItemFound') }}
          </p>
          <p v-else class="text-neutral-foreground-low">{{ t('messages.noResultsFound') }}</p>
        </div>
      </template>
    </b-table>

    <!-- Empty State -->

    <!-- Formulário de usuário -->
    <UserForm
      v-if="showFormControl"
      v-model="showForm"
      :user="editingUser"
      :all-accounts="allAccounts"
      :loading-user-data="isLoadingUserData"
      @save="onSave"
      @close="onCloseForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, inject } from 'vue'
import UserForm from '@/features/users/components/UserForm.vue'
import type { User, UsersQueryParams } from '@/features/users/types/user.type'
import { useUsers } from '@/features/users/composables/useUsers'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import { useI18n } from 'vue-i18n'
import TitleBar from '@/shared/components/TitleBar.vue'
import type { TitleBarAction } from '@/shared/components/TitleBar.vue'

const confirm = inject('confirm') as Function
const { t } = useI18n()

// Composables
const { users, isLoading, paginationMeta, getAllUsers, saveUser, deleteUser, getUserWithRelations } = useUsers()
const { getAllAccounts } = useAccounts()

// Estado da busca e paginação
const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentSortBy = ref('name')
const currentSortDesc = ref(false)

// Debounce timer universal
let universalDebounceTimer: NodeJS.Timeout | null = null

// Função universal com debounce
const debouncedFetchUsers = async (params: UsersQueryParams = {}, delay: number = 0) => {
  if (universalDebounceTimer) {
    clearTimeout(universalDebounceTimer)
  }

  universalDebounceTimer = setTimeout(async () => {
    const queryParams: UsersQueryParams = {
      page: paginationMeta.value.currentPage,
      limit: itemsPerPage.value,
      sortBy: currentSortBy.value as 'createdAt' | 'updatedAt' | 'name' | 'email',
      sortOrder: currentSortDesc.value ? 'DESC' : 'ASC',
      ...params,
    }

    if (searchQuery.value) {
      queryParams.search = searchQuery.value
    }

    await getAllUsers(queryParams)
  }, delay)
}

// Estados do formulário
const allAccounts = ref<Array<any>>([])
const editingUser = ref<User>({} as User)
const deletingUser = ref({} as any)
const editingIndex = ref(0)
const showForm = ref(false)
const showDelete = ref(false)
const showFormControl = ref(false)
const isLoadingUserData = ref(false)

// Configuração das colunas da tabela
const tcolumns = ref([
  {
    text: t('btable.name'),
    label: t('btable.name'),
    value: 'name',
    sortable: true,
    width: '50%',
  },
  {
    text: t('btable.email'),
    label: t('btable.email'),
    value: 'email',
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

// Função fetchUsers inicial otimizada
const fetchUsers = async () => {
  showForm.value = false
  forceResetForm()
  await debouncedFetchUsers({}, 0) // Carregamento inicial sem delay
  const accounts = await getAllAccounts()
  allAccounts.value = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }))
  editingUser.value = {} as User
}

// Handlers otimizados
const handlePageChange = async (page: number) => {
  paginationMeta.value.currentPage = page
  await debouncedFetchUsers({}, 50) // Pequeno delay para UX fluida
}

const handleItemsPerPageChange = async (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage
  paginationMeta.value.limit = newItemsPerPage
  paginationMeta.value.currentPage = 1
  await debouncedFetchUsers({}, 100) // Delay maior para mudança significativa
}

const handleSortBy = async (key: string, isSortDesc: boolean = false) => {
  // Atualizar os estados com os valores recebidos
  if (key) {
    currentSortBy.value = key
  }
  currentSortDesc.value = isSortDesc

  // Ordenação instantânea - sem delay
  await debouncedFetchUsers({}, 0)
}

// Actions da TitleBar
const titleBarActions = computed<TitleBarAction[]>(() => [
  {
    key: 'add-user',
    text: t('users.addUser'),
    icon: 'add_circle',
    color: 'primary',
    onClick: createUser,
  },
])

onMounted(async () => {
  await fetchUsers()
})

async function handleSearchChange() {
  paginationMeta.value.currentPage = 1

  await debouncedFetchUsers({}, 300)
}

const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString).len
    if (isNaN(date.getTime())) return '-'

    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (e) {
    return '-'
  }
}

// Handlers de CRUD
const onEdit = async (val: any, index: number) => {
  showFormControl.value = false
  editingIndex.value = index
  isLoadingUserData.value = true

  // Define usuário temporário com ID para indicar edição
  editingUser.value = {
    ...val,
    userAccounts: [], // Será populado pela API
  }

  // Mostra sidebar imediatamente
  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })

  try {
    // Busca o usuário com as relações userAccounts para edição
    const fullUser = await getUserWithRelations(val.id)
    editingUser.value = fullUser
  } finally {
    isLoadingUserData.value = false
  }
}

const onDeleteUser = async (val: any) => {
  await deleteUser(val)
  closeDelete()
  await fetchUsers()
}

const createUser = () => {
  // Limpa completamente os dados do usuário
  editingUser.value = {
    name: '',
    email: '',
    profileImage: '',
    userAccounts: [],
    isSuperAdmin: false,
  } as User
  editingIndex.value = 0
  isLoadingUserData.value = false

  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })
}

const forceResetForm = () => {
  // Limpa completamente os dados para evitar persistência
  editingUser.value = {} as User
  isLoadingUserData.value = false

  setTimeout(() => {
    showFormControl.value = false
  }, 500)
}

const onSave = async (editingUser: any, isEditing: boolean) => {
  try {
    await saveUser(editingUser, isEditing)
    await fetchUsers()

    // Fechar o form após salvar com sucesso
    showForm.value = false
    forceResetForm()
  } finally {
    // Reset dos estados de loading
    isLoadingUserData.value = false
  }
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
  if (data && users.value[editingIndex.value]) {
    users.value[editingIndex.value] = data
  }

  // Reset completo do estado
  editingUser.value = {} as User
  isLoadingUserData.value = false
  showForm.value = false
  forceResetForm()
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.main-container {
  @apply p-lg;
}
</style>
