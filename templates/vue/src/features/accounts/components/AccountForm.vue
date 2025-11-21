<template>
  <Drawer v-model="model" size="40%" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <div class="form-header">
        <h2>{{ isEditing ? t('accounts.editAccount') : t('accounts.addAccount') }}</h2>
        <Button icon="close" size="small" variant="plain" color="neutral" round @click="closeForm" />
      </div>
      <div class="form-content">
        <Input
          v-model="editingAccount.name"
          :label-value="t('accounts.sideBarLabels.name')"
          :is-error="editingAccount.name != '' && editingAccount.name.length < 3"
          :error-message="t('accounts.sideBarLabels.name')"
          :disabled="isEditing"
          required
        />

        <Input
          v-model="editingAccount.domain"
          :label-value="t('accounts.sideBarLabels.domain')"
          :is-error="!isValidDomain && editingAccount.domain != ''"
          :error-message="t('accounts.sideBarLabels.domain')"
          required
        />

        <Textarea
          v-model="editingAccount.description"
          :label-value="t('accounts.sideBarLabels.description')"
          :is-error="editingAccount.description != '' && editingAccount.description?.length < 3"
          :error-message="t('accounts.sideBarLabels.description')"
          required
        />
      </div>
      <div class="form-actions">
        <Button variant="secondary" @click="closeForm">
          {{ t('cancel') }}
        </Button>
        <Button :disabled="!saveConditions" @click="emit('save', editingAccount, isEditing)">
          {{ t('save') }}
        </Button>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue'
import type { Account } from '@/features/accounts/types/account.type'

const props = defineProps<{
  modelValue: boolean
  account: Account
}>()

const emit = defineEmits<{
  (e: 'save', account: Account, isEditing: boolean): void
  (e: 'close'): void
  (e: 'update:modelValue', value: boolean): void
}>()

const t = inject('t') as Function

const model = defineModel<boolean>('modelValue')

const editingAccount = ref({ ...props.account })
const isEditing = ref(!!props.account.id)

const saveConditions = computed(() => {
  return editingAccount.value.name?.length >= 3 && isValidDomain.value && editingAccount.value.description?.length >= 3
})

const isValidDomain = computed(() => {
  const domain = editingAccount.value.domain.trim()
  const domainRegex = /^(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
})

watch(
  () => props.modelValue,
  (value) => {
    model.value = value
  },
)

watch(
  () => props.account,
  (value) => {
    editingAccount.value = value
  },
)

const updateModelValue = (value: boolean) => {
  model.value = value
  if (!value) closeForm()
  emit('update:modelValue', value)
}

const closeForm = () => {
  updateModelValue(false)  
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.form-wrapper {
  @apply flex flex-col gap-sm h-screen p-lg;
}

.form-header {
  @apply flex justify-between items-center gap-sm;
}

.form-content {
  @apply flex flex-col gap-xl flex-1;
}

.form-actions {
  @apply flex justify-end gap-sm;
}
</style>
