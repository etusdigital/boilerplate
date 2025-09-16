<template>
  <div class="main-container">
    <h1>{{ $t('settings.settings') }}</h1>
    <div class="settings-wrapper">
      <Card v-for="route in settingsRoutes" :key="route.path" class="settings-card" @click="navigateTo(route.path)">
        <div class="settings-card-header">
          <Icon :name="route.icon" />
          <h2>{{ route.label }}</h2>
        </div>
        <Separator />
        <p>{{ route.description }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const settingsRoutes = ref([
  {
    label: t('users.users'),
    icon: 'group',
    path: '/users',
    description: t('users.description'),
  },
  {
    label: t('accounts.accounts'),
    icon: 'corporate_fare',
    path: '/accounts',
    description: t('accounts.description'),
  },
])

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.main-container {
  @apply flex flex-col gap-sm;
}

.settings-wrapper {
  @apply grid gap-sm mt-sm;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.settings-card {
  @apply grid grid-rows-2 gap-sm cursor-pointer transition-transform duration-200;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.settings-card:hover {
  @apply shadow-md scale-105;
}

.settings-card-header {
  @apply flex gap-sm p-sm;
}

.settings-card .icon {
  @apply text-3xl;
}

.settings-card p {
  @apply p-sm;
}
</style>
