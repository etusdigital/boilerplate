<template>
  <BMenu :expanded="true" v-model="selected" :items="filteredMenuItems" @update:model-value="updateSelectedMenu" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  selectedMenu: String,
  menuItems: Array,
});

const filteredMenuItems = computed(() => {
  return props.menuItems.filter((item: any) => {
    return item.show ? item.show : true
  })
})

const emit = defineEmits<{
  'update:selectedMenu': [value: string]
  'update:menuExpanded': [value: boolean]
}>()

const selected = computed(() => {
  return props.selectedMenu
})

function updateSelectedMenu(value: string) {
  emit('update:selectedMenu', value)
}
</script>

<style scoped>
.b-menu {
  z-index: 50;
  position: sticky;
  top: 64.8px;
  height: calc(100vh - 64.8px);
}
</style>
