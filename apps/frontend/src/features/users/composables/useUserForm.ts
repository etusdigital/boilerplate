import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/app/stores'
import type { Ref } from 'vue'

// Define a type for roles
interface Role {
  accountId: string
  role: string
  accountName: string
}

// Define a type for user accounts if not already defined
interface UserAccount {
  accountId: string
  role: string
  account: {
    name: string
  }
}

export function useUserForm(props: any, emit: any) {
  const mainStore = useMainStore()

  const isSameUser = computed(() => props.user?.id === mainStore.user?.id)
  const model = ref(props.modelValue)
  const editingUser = ref({ ...props.user })
  const allAccountsParsed = ref([...props.allAccounts])
  allAccountsParsed.value = allAccountsParsed.value.map((account) => ({
    ...account,
  }))

  const parsedPermissions: Ref<Role[]> = ref([])

  const getParsedRole = (role: string) => {
    const lowerCaseRole = role.toLowerCase()
    return (lowerCaseRole.charAt(0).toUpperCase() + lowerCaseRole.slice(1)) as 'Reader' | 'Writer' | 'Admin'
  }

  parsedPermissions.value = (editingUser.value.userAccounts || []).map(
    (acc: UserAccount) =>
      ({
        accountId: acc.accountId,
        role: getParsedRole(acc.role) || 'Reader',
        accountName: acc.account.name,
      }) as Role,
  )

  const isEditing = ref(!!props.user.id)

  const isValidUrl = computed(() => {
    try {
      new URL(editingUser.value.profileImage || '')
      return true
    } catch (error) {
      return false
    }
  })

  const editedUserAccounts: Ref<Role[]> = ref([])
  editedUserAccounts.value = parsedPermissions.value

  const editingUserBind = computed(() => ({
    ...editingUser.value,
    userAccounts: editedUserAccounts.value,
  }))

  const updateSelectedPermissions = (value: Role[]) => {
    editedUserAccounts.value = value.map((p) => ({ ...p, role: p.role.toLowerCase() as 'reader' | 'writer' | 'admin' }))
  }

  const changeSuperAdmin = (value: boolean) => {
    editingUser.value.isSuperAdmin = value
  }

  const updateModelValue = (value: boolean) => {
    model.value = value
    emit('update:modelValue', value)
  }

  const closeForm = () => {
    emit('close', isEditing.value ? props.user : null)
  }

  watch(
    () => props.modelValue,
    (value) => {
      model.value = value
    },
  )

  return {
    model,
    isSameUser,
    editingUser,
    allAccountsParsed,
    parsedPermissions,
    isEditing,
    isValidUrl,
    editedUserAccounts,
    editingUserBind,
    updateSelectedPermissions,
    changeSuperAdmin,
    updateModelValue,
    closeForm,
  }
}
