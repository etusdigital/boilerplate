<template>
  <div>
    <b-confirm style="z-index: 2000" />
    <b-toast />
    <BNavbar title="BackOffice" :profile="profile" class="sticky top-0" style="z-index: 50">
      <div>
        <BSelect v-if="!mainStore.isLoading" :modelValue="selectedAccount.name" @update:modelValue="changeAccount"
          :absolute="true" :items="selectItems" :required="false" :searchable="false" :secondary="false"
          valueKey="value" />
      </div>
    </BNavbar>
    <div class="flex">
      <Menu v-model="selectedMenu" :expanded="menuExpanded" :menuItems="menuItems"
        @update:selectedMenu="handleMenuSelect" />

      <div v-if="!mainStore.isLoading" class="flex-1 pt-0 p-base">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/app/stores';

const router = useRouter()
const route = useRoute()
provide('router', router)
provide('route', route)
const mainStore = useMainStore();

const profile = ref({
  name: mainStore.user.name,
  src: mainStore.user.profileImage
});

const selectItems = mainStore.user.userAccounts.map((account) => ({
  label: account.account.name,
  value: account.account.id
}));

const selectedAccount = mainStore.selectedAccount;

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  items?: MenuItem[]
  show?: boolean
}

const menuExpanded = ref(false)
const menuItems = ref<MenuItem[]>([
  {
    label: 'Home',
    value: 'home',
    icon: 'home',
    path: '/',
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: 'settings',
    path: '/settings',
    show: !!mainStore.user.isAdmin,
    bottom: true,
  },
])
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

const changeAccount = (value: any) => {
  mainStore.changeAccount(value.value)
}

</script>

<style>
div[type] {
  border: unset;
}

.table-action {
  cursor: pointer;
}

.main-container {
  max-width: 1900px;
  margin: 0 auto;
}

.form-container {
  min-height: 80px;
}
</style>
