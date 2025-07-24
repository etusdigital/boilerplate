<template>
    <div class="title-bar">
        <h1 class="title">{{ title }}</h1>
        <div class="actions" v-if="actions && actions.length > 0">
            <BButton v-for="action in actions" :key="action.key" :color="action.color || 'primary'"
                :size="action.size || 'medium'" :disabled="action.disabled || false" :loading="action.loading || false"
                @click="action.onClick" class="action-button">
                <BIcon v-if="action.icon" :name="action.icon" class="action-icon" />
                {{ action.text }}
            </BButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

export interface TitleBarAction {
    key: string
    text: string
    icon?: string
    color?: string
    size?: string
    disabled?: boolean
    loading?: boolean
    onClick: () => void
}

defineProps<{
    title: string
    actions?: TitleBarAction[]
}>()
</script>

<style scoped>
.title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0;
}

.title {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
    font-family: "Poppins", sans-serif;
    color: var(--color-text-primary, #1a1a1a);
}

.actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    font-size: 1rem;
    white-space: nowrap;
}

.action-icon {
    font-size: 1.2rem;
}
</style>