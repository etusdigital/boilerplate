import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/app/stores'
import type { Ref } from 'vue'

export type RoleType = 'reader' | 'writer' | 'admin'

export interface Role {
  accountId: string
  role: RoleType
  accountName: string
}

export interface UserAccount {
  userAccounts: never[]
  accountId: string
  role: RoleType
  account: {
    name: string
  }
}

export function useUserForm(props: any, emit: any) {
  const mainStore = useMainStore()

  const isSameUser = computed(() => props.user?.id === mainStore.user?.id)
  const model = ref(props.modelValue)
  const editingUser = ref({ ...props.user })
  const parsedPermissions: Ref<Role[]> = ref(parsePermissions())
  const editedUserAccounts: Ref<Role[]> = ref(parsedPermissions.value || [])
  const allAccountsParsed = ref(
    [...props.allAccounts].map((account) => ({
      ...account,
    })),
  )

  const isEditing = computed(() => !!editingUser.value.id)
  const isValidUrl = computed(() => {
    try {
      new URL(editingUser.value.profileImage || '')
      return true
    } catch (error) {
      return false
    }
  })
  const isValidEmail = computed(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.value.email || '')
  })
  const editingUserBind = computed(() => ({
    ...editingUser.value,
    userAccounts: editedUserAccounts.value,
  }))

  watch(
    () => props.modelValue,
    (value) => {
      model.value = value
    },
  )

  watch(
    () => props.user,
    (newUser) => {
      if (JSON.stringify(newUser) === JSON.stringify(editingUser.value)) return
      updateUserData(newUser)
    },
    { deep: true, immediate: true },
  )

  function updateUserData(newUser: any) {
    editingUser.value = { ...newUser }

    if (!newUser.id) {
      parsedPermissions.value = []
      editedUserAccounts.value = []
    } else {
      parsedPermissions.value = parsePermissions(newUser)
      editedUserAccounts.value = parsedPermissions.value
    }
  }

  function parsePermissions(newUser: UserAccount = editingUser.value) {
    return (newUser.userAccounts || []).map(
      (acc: UserAccount) =>
        ({
          accountId: acc.accountId,
          role: acc.role || 'reader',
          accountName: acc.account.name,
        }) as Role,
    )
  }

  function updateSelectedPermissions(value: Role[]) {
    editedUserAccounts.value = value.map((p) => ({ ...p }))
  }

  function changeSuperAdmin(value: boolean) {
    editingUser.value.isSuperAdmin = value
  }

  function updateModelValue(value: boolean) {
    model.value = value
    emit('update:modelValue', value)
  }

  function closeForm() {
    emit('close', isEditing.value ? props.user : null)
  }

  return {
    model,
    isSameUser,
    editingUser,
    allAccountsParsed,
    parsedPermissions,
    isEditing,
    isValidUrl,
    isValidEmail,
    editedUserAccounts,
    editingUserBind,
    updateSelectedPermissions,
    changeSuperAdmin,
    updateModelValue,
    closeForm,
    updateUserData,
  }
}
