<template>
  <div class="main-container">
    <TitleBar :title="t('users')" :actions="titleBarActions" />

    <Input v-model="searchQuery" type="search" :placeholder="t('search')" @input="handleSearchChange" />

    <Table
      class="w-full mt-base"
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
          <div class="flex justify-center gap-xxs">
            <Button icon="edit" size="small" variant="plain" color="neutral" round @click="onEdit(item, index)" />
            <Button icon="delete" size="small" variant="plain" color="danger" round @click="onDelete(item)" />
          </div>
        </td>
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center p-base text-neutral-foreground-low">
          <p v-if="paginationMeta.totalItems === 0">
            {{ t('table.noItemFound') }}
          </p>
          <p v-else>{{ t('table.noResultsFound') }}</p>
        </div>
      </template>

      <template #items-per-page>{{ t('table.itemsPerPage') }}</template>
      <template #showing-page="{ min, max, total }">
        {{ t('table.showingNofN', [min, max, total]) }}
      </template>
    </Table>

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
import { useUsers } from '@/features/users/composables/useUsers'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import type { TitleBarAction } from '@/shared/components/TitleBar.vue'
import type { User, UsersQueryParams } from '@/features/users/types/user.type'
import TitleBar from '@/shared/components/TitleBar.vue'
import UserForm from '@/features/users/components/UserForm.vue'

const confirm = inject('confirm') as Function
const t = inject('t') as Function

const { users, isLoading, paginationMeta, getAllUsers, saveUser, deleteUser, getUserWithRelations } = useUsers()
const { getAllAccounts } = useAccounts()

const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentSortBy = ref('name')
const currentSortDesc = ref(false)

let universalDebounceTimer: NodeJS.Timeout | null = null

const allAccounts = ref<Array<any>>([])
const editingUser = ref<User>({} as User)
const editingIndex = ref(0)
const showForm = ref(false)
const showFormControl = ref(false)
const isLoadingUserData = ref(false)

const tcolumns = ref([
  {
    text: t('table.name'),
    label: t('table.name'),
    value: 'name',
    sortable: true,
    width: '50%',
  },
  {
    text: t('table.email'),
    label: t('table.email'),
    value: 'email',
    sortable: true,
  },
  {
    text: t('table.updatedAt'),
    label: t('table.updatedAt'),
    value: 'updatedAt',
    sortable: true,
  },
  {
    text: t('table.deletedAt'),
    label: t('table.deletedAt'),
    value: 'deletedAt',
    sortable: true,
  },
])

const titleBarActions = computed<TitleBarAction[]>(() => [
  {
    key: 'add-user',
    text: t('users.addUser'),
    icon: 'add_circle',
    color: 'primary',
    onClick: onCreate,
  },
])

onMounted(async () => {
  await fetchUsers()
})

async function debouncedFetchUsers(params: UsersQueryParams = {}, delay: number = 0) {
  if (universalDebounceTimer) clearTimeout(universalDebounceTimer)

  universalDebounceTimer = setTimeout(async () => {
    const queryParams: UsersQueryParams = {
      page: paginationMeta.value.currentPage,
      limit: itemsPerPage.value,
      sortBy: currentSortBy.value as 'createdAt' | 'updatedAt' | 'name' | 'email',
      sortOrder: currentSortDesc.value ? 'DESC' : 'ASC',
      ...params,
    }

    if (searchQuery.value) queryParams.search = searchQuery.value

    await getAllUsers(queryParams)
  }, delay)
}

async function fetchUsers() {
  showForm.value = false
  forceResetForm()
  await debouncedFetchUsers({}, 0)
  const accounts = await getAllAccounts()
  allAccounts.value = accounts.map((account: any) => ({
    label: account.name,
    value: account.id,
  }))
  editingUser.value = {} as User
}

async function handlePageChange(page: number) {
  paginationMeta.value.currentPage = page
  await debouncedFetchUsers({}, 50)
}

async function handleItemsPerPageChange(newItemsPerPage: number) {
  itemsPerPage.value = newItemsPerPage
  paginationMeta.value.limit = newItemsPerPage
  paginationMeta.value.currentPage = 1
  await debouncedFetchUsers({}, 100)
}

async function handleSortBy(key: string, isSortDesc: boolean = false) {
  if (key) currentSortBy.value = key

  currentSortDesc.value = isSortDesc

  await debouncedFetchUsers({}, 0)
}

async function handleSearchChange() {
  paginationMeta.value.currentPage = 1

  await debouncedFetchUsers({}, 300)
}

function formatDisplayDate(dateString: string): string {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
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

function onCreate() {
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

async function onSave(editingUser: any, isEditing: boolean) {
  try {
    await saveUser(editingUser, isEditing)
    await fetchUsers()

    showForm.value = false
    forceResetForm()
  } finally {
    isLoadingUserData.value = false
  }
}

async function onEdit(val: any, index: number) {
  editingIndex.value = index
  isLoadingUserData.value = true

  editingUser.value = {
    ...val,
    userAccounts: [],
  }

  showFormControl.value = true
  nextTick(() => {
    showForm.value = true
  })

  try {
    const fullUser = await getUserWithRelations(val.id)
    editingUser.value = fullUser
  } finally {
    isLoadingUserData.value = false
  }
}

async function onDelete(user: User) {
  const result = await confirm({
    title: t('deleteUser'),
    message: `${t('deleteUserConfirm')}: ${user.name}?`,
    acceptLabel: t('delete'),
    cancelLabel: t('cancel'),
  })

  if (!result) return

  await deleteUser(user)
  await fetchUsers()
}

function forceResetForm() {
  editingUser.value = {} as User
  isLoadingUserData.value = false

  setTimeout(() => {
    showFormControl.value = false
  }, 500)
}

function onCloseForm() {
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
