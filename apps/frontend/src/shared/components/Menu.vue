<template>
  <Menu expanded :options="options" @update:model-value="updateSelectedMenu" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { routes } from '@/app/router'

type MenuItem = {
  label: string
  value: string
  icon: string
  path: string
  bottom?: boolean
  items?: MenuItem[]
}

const { t } = useI18n({ useScope: 'global' })

const options = ref<MenuItem[]>(routes.filter((route) => !route.icon && route.meta?.title).map((route) => ({
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
