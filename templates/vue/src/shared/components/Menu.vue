<template>
  <Sidebar v-model="selectedItem" expanded :options="options" />
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { routes } from '@/app/router'
import type { RouteRecordRaw } from 'vue-router'
import type { Ref } from 'vue'

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  options?: MenuItem[]
}

const t = inject('t') as Function
const locale = inject('locale') as Ref<string>

const selectedItem = ref('')

// Make options reactive to language changes
const options = computed<MenuItem[]>(() => {
  // Access locale to create reactivity dependency
  const _ = locale.value
  return parseRoutes(routes)
})

function parseRoutes(routes: RouteRecordRaw[]): MenuItem[] {
  return routes
    .filter((route: RouteRecordRaw) => route.meta?.icon && route.meta?.title)
    .map((route: RouteRecordRaw) => ({
      label: t(route.meta.title as string),
      value: route.name as string,
      icon: route.meta?.icon,
      path: route.path,
      bottom: route.meta?.bottom,
      options: route.children ? parseRoutes(route.children) : [],
    }))
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.menu {
  @apply z-50 sticky top-[64.8px];
}
</style>
