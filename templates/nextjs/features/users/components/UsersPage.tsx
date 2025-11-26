'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  TitleBar,
  TitleBarAction,
  Input,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@boilerplate/ui-react'
import { UsersTable } from './UsersTable'
import { UserDrawer } from './UserDrawer'
import { usersApi } from '../api'
import { User, PaginationMeta } from '../types'
import { accountsApi } from '@/features/accounts/api'
import { Account } from '@/features/accounts/types'
import { useTableSort } from '@/features/shared/hooks/useTableSort'

type UserSortColumn = 'name' | 'email' | 'createdAt' | 'updatedAt' | 'deletedAt'

export function UsersPage() {
  const { t } = useTranslation()

  const [users, setUsers] = useState<User[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { sortBy, sortOrder, handleSortChange, getSortIcon } = useTableSort<UserSortColumn>('name')

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await accountsApi.list({ page: 1, limit: 100 })
      setAccounts(response.data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await usersApi.list({
        page: currentPage,
        limit: itemsPerPage,
        query: searchQuery,
        sortBy,
        sortOrder,
      })
      setUsers(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, searchQuery, sortBy, sortOrder])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [fetchUsers])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }, [])

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

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsDrawerOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await usersApi.delete(String(userToDelete.id))
      toast.success(t('users.deleteSuccess'))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (error) {
      console.error('Delete user error:', error)
      toast.error(t('users.deleteError'))
    }
  }

  const handleSave = async (userData: Partial<User>) => {
    try {
      if (editingUser && editingUser.id) {
        await usersApi.update(String(editingUser.id), userData)
        toast.success(t('users.updateSuccess'))
      } else {
        await usersApi.create(userData)
        toast.success(t('users.createSuccess'))
      }

      setIsDrawerOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Save user error:', error)
      toast.error(editingUser ? t('users.updateError') : t('users.createError'))
      throw error
    }
  }

  return (
    <div className="main-container p-md">
      <TitleBar title={t('navigation.users')} actions={titleBarActions} />

      <div className="mb-base">
        <div className="relative bg-white rounded-sm" style={{ outline: '1px solid rgb(227, 231, 234)' }}>
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-foreground pointer-events-none text-2xl">search</span>
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
