<template>
  <Canvas v-if="!mainStore.isLoading" />
  <div v-else>
    <div class="flex justify-center items-center h-screen">
      <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Canvas from './views/Canvas.vue'
import { useMainStore } from './stores/index'

const mainStore = useMainStore()
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

.profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 1rem;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
}

.profile-email {
  font-size: 12px;
  font-weight: 400;
}
</style>
