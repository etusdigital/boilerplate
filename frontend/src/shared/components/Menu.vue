<template>
    <BMenu
        v-model="selected"
        :items="menuItems"
        @update:model-value="updateSelectedMenu"/>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps(
    {
        selectedMenu: String,
        menuItems: Array
    }
);

const emit = defineEmits<{
	"update:selectedMenu": [value: string];
	"update:menuExpanded": [value: boolean];
}>();

const selected = computed(() => {
    return props.selectedMenu
});


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