<template>
  <div>
    <b-confirm style="z-index: 2000" />
    <b-toast />
    <BNavbar
      title="BackOffice"
      :profile="{
        name: 'rafa',
        src: 'https://gitlab.com/uploads/-/system/project/avatar/64374217/martin-luther-king-land-of-dreams.jpg',
      }"
      class="sticky top-0"
      style="z-index: 50"
    >
      <div />
    </BNavbar>
    <div class="flex">
      <Menu
        v-model="selectedMenu"
        :expanded="menuExpanded"
        :menuItems="menuItems"
        @update:selectedMenu="handleMenuSelect"
      />

      <div class="flex-1 pt-0 p-base">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/app/stores'

const router = useRouter()
const route = useRoute()
provide('router', router)
provide('route', route)

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  subItems?: MenuItem[]
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
    label: 'Users',
    value: 'users',
    icon: 'group',
    path: '/users',
  },
  {
    label: 'Configurações',
    value: 'settings',
    icon: 'settings',
    path: '/settings',
    bottom: true,
    subItems: [],
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
