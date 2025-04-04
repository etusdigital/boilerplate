<template>
    <Transition name="page" mode="out-in">
        <div class="main-container">
            <h1 class="core-app-title">Accounts</h1>
            <!-- início b-round-button usado para adicionar um novo usuário -->
            <b-round-button text="Adicionar Conta" @click="createAccount" />
            <!-- fim b-round-button -->
            <!-- início b-table usada para listar os usuários -->
            <b-table :headers="tcolumns" :items="tdata" :options="{ sortBy: 'name', sortDesc: false }"
                :loading="isLoading" :itemsPerPage="itemsPerPage" v-model:page="page"
                v-model:items-per-page="itemsPerPage">
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
            <AccountForm v-if="showForm" v-model="showForm" :account="editingAccount" @save="onSave"
                @close="onCloseForm" />
            <!-- início b-dialog usado para deletar o usuário e controlado por flags como: showDelete e closeDelete -->
            <b-dialog v-model="showDelete" :width="1000" class="op">
                <div class="form-wrapper">
                    <h1>Deletar Usuário</h1>
                    <p class="text-danger">
                        Tem certeza que deseja deletar o usuário: <b>{{ deletingAccount.email }}</b>?
                    </p>
                    <p class="text-danger">Esta ação é irreversível.</p>
                    <div class="form-actions">
                        <div class="flex items-center justify-between w-full form-container">
                            <b-button color="primary" :disabled="false" :loading="false" size="medium" type="button"
                                @click="closeDelete">
                                Cancelar
                            </b-button>
                            <b-button color="danger" :disabled="false" size="medium" type="submit"
                                @click="onDeleteAccount(deletingAccount)">
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
import { ref, computed, onMounted, inject } from 'vue'
import AccountForm from '@/features/accounts/components/AccountForm.vue'
import type { Account } from '@/features/accounts/types/account.type'
import { useAccounts } from '@/features/accounts/composables/useAccounts'

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
        text: 'Description',
        label: 'Description',
        value: 'description',
        sortable: true,
    },
    {
        text: 'Join Date',
        label: 'Join Date',
        value: 'created_at',
        sortable: true,
    },
    {
        text: 'End Date',
        label: 'End Date',
        value: 'deleted_at',
        sortable: true,
    },
])

const tdata = ref<Array<Account>>([])
const editingAccount = ref<Account>({} as Account)
const deletingAccount = ref({} as any)
const editingIndex = ref(0)
const { getAllAccounts, saveAccount, deleteAccount } = useAccounts()

const showForm = computed(() => {
    return !isLoading.value && !!tdata.value.length && !!Object.keys(editingAccount.value).length
})

const onDeleteAccount = async (val: any) => {
    await deleteAccount(val)
    closeDelete()
    fetchAccounts()
}

const createAccount = () => {
    editingAccount.value = {
        name: '',
        description: '',
        domain: '',
    } as Account
    editingIndex.value = 0
}

const showDelete = ref(false)

const onEdit = (val: any, index: number) => {
    editingAccount.value = val
    editingIndex.value = index
}

const fetchAccounts = async () => {
    isLoading.value = true
    tdata.value = await getAllAccounts()
    editingAccount.value = {} as Account
    isLoading.value = false
}

const onSave = async (editingAccount: any, isEditing: boolean) => {
    await saveAccount(editingAccount, isEditing)
    fetchAccounts()
}

const closeDelete = () => {
    showDelete.value = false
    deletingAccount.value = {}
}

const onDelete = async (val: any) => {
    deletingAccount.value = val
    showDelete.value = true
}

const onCloseForm = (data: any) => {
    if (data && tdata.value[editingIndex.value]) {
        tdata.value[editingIndex.value] = data
    }
    editingAccount.value = {} as Account
}

onMounted(() => {
    fetchAccounts()
})
</script>

<style>
.main-container {
    padding: 20px;
}
</style>