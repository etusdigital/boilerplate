<template>
  <Canvas v-if="!mainStore.isLoading" />
  <Spinner class="text-5xl" v-else />
  <Confirm />
  <Toast />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMainStore } from './stores/index'
import Canvas from './views/Canvas.vue'

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })
provide('router', router)
provide('route', route)
provide('t', t)
provide('locale', locale)
</script>

<style>
@reference "@/app/assets/main.css";

div[type] {
  border: unset;
}

.main-container {
  max-width: 1900px;
  margin: 0 auto;
}

.form-container {
  @apply min-h-6xl;
}
</style>
