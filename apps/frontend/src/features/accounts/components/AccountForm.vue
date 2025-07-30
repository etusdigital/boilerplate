<template>
  <b-sidebar v-model="model" :noOutsideClose="false" width="40%" @update:model-value="updateModelValue">
    <div class="form-wrapper">
      <div class="form-header flex flex-row items-center gap-4">
        <BIcon name="close" @click="closeForm" class="cursor-pointer" />
        <div class="title">{{ isEditing ? t('accounts.editAccount') : t('accounts.addAccount') }}</div>
        <div class="save-container">
          <b-button color="primary" :disabled="!saveConditions" :loading="false" size="medium" type="button"
            @click="emit('save', editingAccount, isEditing)">
            {{ t('save') }}
          </b-button>
        </div>
      </div>
      <div class="flex flex-col items-start justify-between w-full gap-xl">
        <BInput v-model="editingAccount.name" :errorMessage="t('accounts.sideBarLabels.name')"
          :isError="(editingAccount.name != '' && editingAccount.name.length < 3)" :labelValue="t('accounts.sideBarLabels.name')"
          :required="true" size="base" type="text" :disabled="isEditing" />

        <BInput v-model="editingAccount.domain" :errorMessage="t('accounts.sideBarLabels.domain')"
          :isError="(!isValidDomain && editingAccount.domain != '')" :labelValue="t('accounts.sideBarLabels.domain')" :required="true"
          size="base" type="text" />

        <BInput v-model="editingAccount.description" :errorMessage="t('accounts.sideBarLabels.description')"
          :isError="(editingAccount.description != '' && editingAccount.description?.length < 3)"
          :labelValue="t('accounts.sideBarLabels.description')" :required="true" :isTextArea="true" size="base" type="text" />
      </div>
    </div>
  </b-sidebar>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Account } from '@/features/accounts/types/account.type'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  account: Account
}>()

const model = defineModel<boolean>('modelValue')

const emit = defineEmits<{
  (e: 'save', account: Account, isEditing: boolean): void
  (e: 'close', account?: Account | null): void
  (e: 'update:modelValue', value: boolean): void
}>()

const editingAccount = ref({ ...props.account })
const isEditing = ref(!!props.account.id)

const saveConditions = computed(() => {
  return editingAccount.value.name?.length >= 3 && isValidDomain.value && editingAccount.value.description?.length >= 3
})

const isValidDomain = computed(() => {
  const domain = editingAccount.value.domain.trim();
  const domainRegex = /^(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
});

const updateModelValue = (value: boolean) => {
  model.value = value
  emit('update:modelValue', value)
};

const closeForm = () => {
  emit('close', isEditing.value ? props.account : null)
};

watch(
  () => props.modelValue,
  (value) => {
    model.value = value
  },
);
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
  position: absolute;
  bottom: 0;
  width: calc(100% - 60px);
  margin: 30px;
}

.form-header .title {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800, #1B1F22);
  font-family: var(--font-family-Font-Family, Poppins);
  font-size: var(--font-size-2xl, 24px);
  font-style: normal;
  font-weight: var(--font-weight-bold, 700);
  line-height: 120%;
}

.save-container {
  position: absolute;
  right: 50px;
}
</style>
