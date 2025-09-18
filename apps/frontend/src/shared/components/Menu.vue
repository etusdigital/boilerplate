<template>
  <Sidebar v-model="selectedItem" expanded :options="options" />
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { routes } from '@/app/router'

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  items?: MenuItem[]
}

const t = inject('t') as Function

const selectedItem = ref('')

const options = ref<MenuItem[]>(routes.filter((route) => route.icon && route.meta?.title).map((route) => ({
  label: t(route.meta.title as string),
  value: route.name as string,
  icon: route.icon,
  path: route.path,
  bottom: route.bottom,
})))
</script>

<style scoped>
@reference "@/app/assets/main.css";

.menu {
  @apply z-50 sticky top-[64.8px];
}
</style>
