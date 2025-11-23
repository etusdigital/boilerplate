import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TitleBar, TitleBarAction } from '@/shared/components/TitleBar'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UsersTable } from '../components/UsersTable'
import { UserDrawer } from '../components/UserDrawer'
import { useUsers } from '../hooks/useUsers'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { useTableSort } from '@/shared/hooks/useTableSort'
import { User } from '../types/user.type'

type UserSortColumn = 'name' | 'email' | 'createdAt' | 'updatedAt' | 'deletedAt'

export function UsersPage() {
  const { t } = useTranslation()
  const {
    users,
    isLoading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers()

  const { accounts, fetchAccounts } = useAccounts()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use reusable sorting hook
  const { sortBy, sortOrder, handleSortChange, getSortIcon } = useTableSort<UserSortColumn>('name')

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts({ page: 1, limit: 100 }) // Fetch all accounts for dropdown
  }, [fetchAccounts])

  // Fetch users on mount and when search, page, items per page, or sorting changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers({
        page: currentPage,
        limit: itemsPerPage,
        query: searchQuery,
        sortBy,
        sortOrder
      })
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentPage, itemsPerPage, sortBy, sortOrder, fetchUsers])

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }, [])

  // TitleBar actions
  const titleBarActions: TitleBarAction[] = [
    {
      key: 'add-user',
      text: t('users.addUser'),
      icon: 'add',
      onClick: () => {
        setEditingUser(null)
        setIsDrawerOpen(true)
      },
    },
  ]

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsDrawerOpen(true)
  }

  // Handle delete user - open confirmation dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // Confirm delete user
  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(String(userToDelete.id))
      toast.success(t('users.deleteSuccess'))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      // Refresh the table
      fetchUsers({ page: currentPage, limit: itemsPerPage, query: searchQuery })
    } catch (error) {
      console.error('Delete user error:', error)
      toast.error(t('users.deleteError'))
    }
  }

  // Handle save user (create or update)
  const handleSave = async (userData: Partial<User>) => {
    try {
      if (editingUser && editingUser.id) {
        // Update existing user
        await updateUser(String(editingUser.id), userData)
        toast.success(t('users.updateSuccess'))
      } else {
        // Create new user
        await createUser(userData)
        toast.success(t('users.createSuccess'))
      }

      setIsDrawerOpen(false)
      setEditingUser(null)
      // Refresh the table
      fetchUsers({ page: currentPage, limit: itemsPerPage, query: searchQuery })
    } catch (error) {
      console.error('Save user error:', error)
      toast.error(editingUser ? t('users.updateError') : t('users.createError'))
      throw error // Re-throw to let the drawer handle it
    }
  }

  return (
    <div className="main-container">
      <TitleBar title={t('navigation.users')} actions={titleBarActions} />

      <div className="mb-4">
        <div className="relative bg-white rounded-md" style={{ outline: '1px solid rgb(227, 231, 234)' }}>
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            search
          </span>
          <Input
            type="search"
            placeholder={t('users.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        getSortIcon={getSortIcon}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onSortChange={handleSortChange}
      />

      <UserDrawer
        open={isDrawerOpen}
        user={editingUser}
        accounts={accounts}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditingUser(null)
        }}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteConfirmDescription', { name: userToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UsersPage
