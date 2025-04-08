<template>
  <div class="menu-container">
    <BMenu :expanded="menuExpanded" v-model="selected" :items="filteredMenuItems"
      @update:model-value="updateSelectedMenu" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  menuExpanded: {
    type: Boolean,
    default: false
  },
  menuItems: {
    type: Array,
    default: () => []
  }
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
.menu-container {
  display: flex;
}

.b-menu {
  z-index: 50;
  position: sticky;
  top: 64.8px;
  height: calc(100vh - 64.8px);
}
</style>
