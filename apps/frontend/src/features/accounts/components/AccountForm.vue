<template>
    <b-dialog v-model="model" :width="width" class="op" @update:model-value="updateModelValue">
        <div class="form-wrapper">
            <h1>Add Account</h1>
            <div class="flex items-start justify-between w-full gap-xs">
                <BInput v-model="editingAccount.name" errorMessage="Name is required"
                    :isError="editingAccount.name.length < 3" labelValue="Account Name" :required="true" size="base"
                    type="text" :disabled="isEditing" />

                <BInput v-model="editingAccount.domain" errorMessage="Domain is invalid" :isError="!isValidDomain"
                    labelValue="Domain" :required="true" size="base" type="text" />
            </div>
            <div class="flex items-center justify-between w-full">
                <BInput v-model="editingAccount.description" errorMessage="Description is required"
                    :isError="editingAccount.description.length < 3" labelValue="Description" :required="true"
                    :isTextArea="true" size="base" type="text" />
            </div>
        </div>

        <div class="form-actions">
            <b-button color="danger" :disabled="false" :loading="false" size="medium" type="button" @click="closeForm">
                Cancelar
            </b-button>
            <b-button color="success" :disabled="false" :loading="false" size="medium" type="button"
                @click="emit('save', editingAccount, isEditing)">
                Salvar
            </b-button>
        </div>
    </b-dialog>
</template>

<script setup lang="ts">
import { ref, watch, inject, computed } from 'vue'
import type { Account } from '@/features/accounts/types/account.type'
import { useMainStore } from '@/app/stores'

const width = 1000
const toast = inject('toast') as any
const mainStore = useMainStore()
const toastOptions = mainStore.toastOptions

const props = defineProps<{
    modelValue: boolean
    account: Account
}>()

const model = defineModel<boolean>('modelValue')
const editingAccount = ref({ ...props.account })

const emit = defineEmits<{
    (e: 'save', account: Account, isEditing: boolean): void
    (e: 'close', account?: Account | null): void
    (e: 'update:modelValue', value: boolean): void
}>()

const isEditing = ref(!!props.account.id)

const isValidDomain = computed(() => {
    const domain = editingAccount.value.domain.trim();
    const domainRegex = /^(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
});

watch(
    () => props.modelValue,
    (value) => {
        model.value = value
    },
)

const updateModelValue = (value: boolean) => {
    model.value = value
    emit('update:modelValue', value)
}

const closeForm = () => {
    emit('close', isEditing.value ? props.account : null)
}
</script>

<style>
.form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 50px;
}

.form-container {
    gap: 1rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: auto;
    margin-right: 15px;
}
</style>