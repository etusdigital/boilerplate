<template>
  <div>
    <Navbar title="Etus Boilerplate" class="z-[50] sticky top-none">
      <div>
        <Select
          v-model="selectedAccount.name"
          absolute
          :options="selectItems"
          @update:modelValue="changeAccount"
        />
      </div>
      <template #logo>
        <img src="/etus-logo.ico" alt="etus-logo" class="etus-logo" />
        <span class="text-lg font-bold">Boilerplate</span>
      </template>
      <template #actions>
        <Select
          v-model="languageName"
          absolute
          :options="languages"
          @update:modelValue="changeLanguage"
        />
        <div class="flex items-center gap-sm">
          <img :src="profile.src" alt="profile" class="profile-image" />
          <div class="profile-details">
            <div class="profile-name">{{ profile.name }}</div>
            <div class="profile-email">{{ profile.email }}</div>
          </div>
          <Tooltip position="bottom" :text="$t('logout')">
            <Button icon="logout" @click="mainStore.logout()" />
          </Tooltip>
        </div>
      </template>
    </Navbar>
    <div class="flex">
      <Menu
        v-model="selectedMenu"
        :options="menuItems"
        @update:selectedMenu="handleMenuSelect"
      />

      <div class="flex-1 pt-none p-base">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '../stores/index'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
provide('router', router)
provide('route', route)
const mainStore = useMainStore()
const { t } = useI18n({ useScope: 'global' })

const img = computed(() => {
  return mainStore.user.profileImage || mainStore.user.picture
})

const profile = ref({
  name: mainStore.user.name,
  src: img.value,
  email: mainStore.user.email,
})

const selectItems = mainStore.user.userAccounts.map((account) => ({
  label: account.account.name,
  value: account.account.id,
}))

const languages = [
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
]

const languageName = computed(() => {
  const found = languages.find((language) => language.value === mainStore.currentLanguage)
  return found?.label || languages[0].label
})

const selectedAccount = mainStore.selectedAccount

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  items?: MenuItem[]
  show?: boolean
}

const menuItems = ref<MenuItem[]>([
  {
    label: t('home'),
    value: 'home',
    icon: 'home',
    path: '/',
  },
  {
    label: t('settings.settings'),
    value: 'settings',
    icon: 'settings',
    path: '/settings',
    show: true,
    bottom: true,
  },
])

//TODO: Verificar o menu no Desing System para respeitar a flag show
menuItems.value = menuItems.value.filter((item) => item.show !== false)

const selectedMenu = ref(menuItems.value.find((item) => item.path === route.path)?.value || '')

const handleMenuSelect = (value: string) => {
  selectedMenu.value = value
}

watch(
  () => route.path,
  (newPath) => {
    selectedMenu.value = menuItems.value.find((item) => item.path === newPath)?.value || ''
  },
)

const changeLanguage = async (value: any) => {
  if (!value.value) return

  if (value.value !== mainStore.currentLanguage) {
    mainStore.setLanguage(value.value)
  }
}

const changeAccount = async (value: any) => {
  if (value.value !== mainStore.selectedAccount.id) {
    await mainStore.changeAccount(value.value)
  }
}
</script>

<style>
@reference "@/app/assets/main.css";

.etus-logo {
  @apply w-2xl h-2xl;
}
</style>