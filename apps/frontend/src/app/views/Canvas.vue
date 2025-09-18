<template>
  <div>
    <Navbar title="Etus Boilerplate" class="z-[50] sticky top-none">
      <Select
        v-model="selectedAccount.name"
        absolute
        :options="selectItems"
        label-key="name"
        value-key="id"
        @update:modelValue="changeAccount"
      />
      <template #logo>
        <img src="/etus-logo.ico" alt="etus-logo" class="etus-logo" />
        <span class="text-lg font-bold">Boilerplate</span>
      </template>
      <template #actions>
        <Select v-model="mainStore.currentLanguage" absolute :options="languages" @update:modelValue="changeLanguage" />
        <div class="flex items-center gap-sm">
          <Avatar :name="profile.name" :src="img" :alt="profile.name" />
          <div class="profile-details">
            <div class="profile-name">{{ profile.name }}</div>
            <div class="profile-email">{{ profile.email }}</div>
          </div>
          <Tooltip position="bottom" :label-value="t('logout')">
            <Button icon="logout" @click="mainStore.logout()" />
          </Tooltip>
        </div>
      </template>
    </Navbar>
    <div class="flex">
      <Menu />
      <div class="flex-1 pt-none p-base">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useMainStore } from '../stores/index'
import Menu from '@/shared/components/Menu.vue'

const t = inject('t')
const mainStore = useMainStore()

const profile = ref({
  name: mainStore.user.name,
  email: mainStore.user.email,
})
const selectItems = ref(mainStore.user?.userAccounts || [])
const languages = ref([
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
])
const selectedAccount = ref(mainStore.selectedAccount)

const img = computed(() => {
  return mainStore.user.profileImage || mainStore.user.picture
})

const changeLanguage = async (language: string) => {
  if (!language || language === mainStore.currentLanguage) return

  mainStore.setLanguage(language)
}

const changeAccount = async (accountId: string) => {
  if (accountId == mainStore.selectedAccount.id) return
  await mainStore.changeAccount(accountId)
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.etus-logo {
  @apply w-2xl h-2xl;
}

.profile-details {
  @apply flex flex-col mr-base;
}

.profile-name {
  @apply text-sm font-bold;
}

.profile-email {
  @apply text-sm;
}
</style>
