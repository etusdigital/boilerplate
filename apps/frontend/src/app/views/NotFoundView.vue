<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h2>{{ t('not_found.title') }}</h2>
    <p class="message-body">
      {{ t('not_found.description') }}
    </p>
    <router-link to="/">
      <Button>{{ t('not_found.button') }}</Button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const t = inject('t') as Function
</script>

<style scoped>
@reference "@/app/assets/main.css";

.not-found-container {
  @apply flex flex-col items-center justify-center gap-base text-center p-base;
}

.message-body {
  @apply text-base;
}
</style>
