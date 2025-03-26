<template>
    <b-dialog v-model="isEditing" :width="width" @update:model-value="changeExpanded" class="op">
        Make form here
    </b-dialog>
</template>
<script setup lang="ts">
const isEditing = true;
const width = 1000;

const changeExpanded = (v) => {
    console.log('changeeeee', v);
};

const editingItem = {
    name: 'fsdfsd'
}
</script>

<style>
.op {
    padding: 80px;
}
</style>