<template>
  <div>
    <h1 class="core-app-title">Settings</h1>
    <div class="settings-wrapper">
      <b-card v-for="route in settingsRoutes" :key="route.path" class="settings-card cursor-pointer"
        @click="navigateTo(route.path)">
        <div class="settings-card-header">
          <b-icon :size="'30px'" :name="route.icon" />
          <h2>{{ route.label }}</h2>
        </div>
        <p>{{ route.description }}</p>
      </b-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

const settingsRoutes = [
  {
    label: 'Users',
    icon: 'group',
    path: '/users',
    description: 'Manage users, their permissions and access to the system.',
  },
  {
    label: 'Accounts',
    icon: 'corporate_fare',
    path: '/accounts',
    description: 'Manage accounts, their names, organizations and more.',
  }
]

</script>

<style scoped>
.settings-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.settings-card {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.settings-card p {
  padding: 1rem;
  color: var(--neutral-interaction-default);
}

.settings-card .b-icon {
  color: var(--primary-interaction-selected);
}

.settings-card-header {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem;
}

.settings-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.settings-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  color: var(--primary-interaction-selected);
}
</style>
