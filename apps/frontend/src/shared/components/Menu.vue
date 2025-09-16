<template>
  <Menu v-model="selected" expanded :items="filteredMenuItems" @update:model-value="updateSelectedMenu" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  menuExpanded: {
    type: Boolean,
    default: false,
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
})

const filteredMenuItems = computed(() => {
  return props.menuItems.filter((item: any) => {
    return item.show !== false
  })
})

const emit = defineEmits(['update:selectedMenu'])

const selected = computed(() => {
  return props.modelValue
})

function updateSelectedMenu(value: string) {
  emit('update:selectedMenu', value)
}
</script>

<style scoped>
@reference "@/app/assets/main.css";

.menu {
  @apply z-50 sticky top-[64.8px];
}
</style>
