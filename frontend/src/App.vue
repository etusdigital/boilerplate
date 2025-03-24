<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Bem-vindo ao Vue 3 + TypeScript!')
</script>

<template>
  <div class="app">
    <header>
      <h1>Minha Aplicação Vue 3</h1>
    </header>
    <main>
      <p>{{ message }}</p>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: #2c3e50;
}
</style>
