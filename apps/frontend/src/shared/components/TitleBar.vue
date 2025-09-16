<template>
  <div class="title-bar">
    <h1 class="title">{{ title }}</h1>
    <div class="actions" v-if="actions && actions.length">
      <Button
        v-for="action in actions"
        :key="action.key"
        :color="action.color"
        :icon="action.icon"
        :size="action.size"
        :disabled="action.disabled"
        :loading="action.loading"
        @click="action.onClick"
        class="action-button"
      >
        {{ action.text }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

export interface TitleBarAction {
  key: string
  text: string
  icon?: string
  color?: string
  size?: string
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

defineProps<{
  title: string
  actions?: TitleBarAction[]
}>()
</script>

<style scoped>
@reference "@/app/assets/main.css";

.title-bar {
  @apply flex justify-between items-center mb-lg p-none;
}

.title {
  @apply m-none text-4xl font-bold;
}

.actions {
  @apply flex items-center gap-sm;
}

.action-button {
  @apply whitespace-nowrap;
}
</style>
