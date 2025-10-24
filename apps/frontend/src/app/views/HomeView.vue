<template>
  <h1>{{ t('greeting') }}</h1>
  <p>{{ t('start_creating') }}</p>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const t = inject('t') as Function
</script>