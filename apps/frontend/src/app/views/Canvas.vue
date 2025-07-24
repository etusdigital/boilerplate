<template>
    <div>
        <b-confirm style="z-index: 2000" />
        <b-toast />
        <BNavbar title="Etus Boilerplate" class="sticky top-0" style="z-index: 50">
            <div>
                <BSelect v-if="!mainStore.isLoading" :modelValue="selectedAccount.name"
                    @update:modelValue="changeAccount" :absolute="true" :items="selectItems" :required="false"
                    :searchable="false" :secondary="false" valueKey="value" />
            </div>
            <template #logo>
                <img src="/etus-logo.ico" alt="etus-logo" class="etus-logo" />
                <span class="text-lg font-bold">Boilerplate</span>
            </template>
            <template #actions>
                <BSelect v-if="!mainStore.isLoading" :modelValue="languageName" @update:modelValue="changeLanguage"
                    :absolute="true" :items="languages" :required="false" :searchable="false" :secondary="false" />
                <div v-if="!mainStore.isLoading" class="flex items-center gap-2">
                    <img :src="profile.src" alt="profile" class="profile-image" />
                    <div class="profile-details">
                        <div class="profile-name">{{ profile.name }}</div>
                        <div class="profile-email">{{ profile.email }}</div>
                    </div>
                    <BTooltip position="bottom" :text="$t('logout')">
                        <b-icon name="logout" @click="mainStore.logout()" class="cursor-pointer" />
                    </BTooltip>
                </div>
            </template>
        </BNavbar>
        <div class="flex">
            <Menu v-if="!mainStore.isLoading" v-model="selectedMenu" :expanded="menuExpanded" :menuItems="menuItems"
                @update:selectedMenu="handleMenuSelect" />

            <div v-if="!mainStore.isLoading" class="flex-1 pt-0 p-base">
                <router-view />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '../stores/index'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
provide('router', router)
provide('route', route)
const mainStore = useMainStore()
const { t } = useI18n({ useScope: 'global' });


const img = computed(() => {
    return mainStore.user.profileImage || mainStore.user.picture
})

const profile = ref({
    name: mainStore.user.name,
    src: img.value,
    email: mainStore.user.email,
})

const selectItems = mainStore.user.userAccounts.map((account) => ({
    label: account.account.name,
    value: account.account.id,
}));

const languages = [
    { label: 'Português', value: 'pt' },
    { label: 'English', value: 'en' },
]

const languageName = computed(() => {
    const found = languages.find((language) => language.value === mainStore.currentLanguage);
    return found?.label || languages[0].label;
})

const selectedAccount = mainStore.selectedAccount

type MenuItem = {
    label: string
    value: string
    icon: string
    path: string
    bottom?: boolean
    items?: MenuItem[]
    show?: boolean
}

const menuExpanded = ref(false)
const menuItems = ref<MenuItem[]>([
    {
        label: t('home'),
        value: 'home',
        icon: 'home',
        path: '/',
    },
    {
        label: t('settings'),
        value: 'settings',
        icon: 'settings',
        path: '/settings',
        show: true,
        bottom: true,
    },
])

//TODO: Verificar o menu no Desing System para respeitar a flag show
menuItems.value = menuItems.value.filter((item) => item.show !== false)

const selectedMenu = ref(menuItems.value.find((item) => item.path === route.path)?.value || '')

const handleMenuSelect = (value: string) => {
    selectedMenu.value = value
}

watch(
    () => route.path,
    (newPath) => {
        selectedMenu.value = menuItems.value.find((item) => item.path === newPath)?.value || ''
    },
)

const changeLanguage = async (value: any) => {

    if (!value.value) return

    if (value.value !== mainStore.currentLanguage) {
        mainStore.setLanguage(value.value)
    }
}

const changeAccount = async (value: any) => {
    if (value.value !== mainStore.selectedAccount.id) {
        await mainStore.changeAccount(value.value)
    }
}

</script>

<style>
.etus-logo {
    width: 40px;
    height: 39px;
}
</style>