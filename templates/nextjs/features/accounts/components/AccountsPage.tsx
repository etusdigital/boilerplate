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
import { AccountsTable } from './AccountsTable'
import { AccountDrawer } from './AccountDrawer'
import { accountsApi } from '../api'
import { Account, PaginationMeta } from '../types'
import { useTableSort } from '@/features/shared/hooks/useTableSort'

type AccountSortColumn = 'name' | 'domain' | 'createdAt' | 'updatedAt'

const PAGE_SIZE = 10

export function AccountsPage() {
  const { t } = useTranslation()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: PAGE_SIZE,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { sortBy, sortOrder, handleSortChange, getSortIcon } = useTableSort<AccountSortColumn>('name')

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await accountsApi.list({
        page: currentPage,
        limit: PAGE_SIZE,
        query: searchQuery,
        sortBy,
        sortOrder,
      })
      setAccounts(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, sortBy, sortOrder])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAccounts()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [fetchAccounts])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const titleBarActions: TitleBarAction[] = [
    {
      key: 'add-account',
      text: t('accounts.addAccount'),
      icon: 'add',
      onClick: () => {
        setEditingAccount(null)
        setIsDrawerOpen(true)
      },
    },
  ]

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setIsDrawerOpen(true)
  }

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!accountToDelete) return

    try {
      await accountsApi.delete(String(accountToDelete.id))
      toast.success(t('accounts.deleteSuccess'))
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
      fetchAccounts()
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error(t('accounts.deleteError'))
    }
  }

  const handleSave = async (accountData: Partial<Account>) => {
    try {
      if (editingAccount && editingAccount.id) {
        await accountsApi.update(String(editingAccount.id), accountData)
        toast.success(t('accounts.updateSuccess'))
      } else {
        await accountsApi.create(accountData)
        toast.success(t('accounts.createSuccess'))
      }

      setIsDrawerOpen(false)
      setEditingAccount(null)
      fetchAccounts()
    } catch (error) {
      console.error('Save account error:', error)
      toast.error(editingAccount ? t('accounts.updateError') : t('accounts.createError'))
      throw error
    }
  }

  return (
    <div className="main-container p-md">
      <TitleBar title={t('accounts.title')} actions={titleBarActions} />

      <div className="mb-4">
        <Input
          type="search"
          placeholder={t('accounts.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      <AccountsTable
        accounts={accounts}
        isLoading={isLoading}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        getSortIcon={getSortIcon}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />

      <AccountDrawer
        open={isDrawerOpen}
        account={editingAccount}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditingAccount(null)
        }}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('accounts.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('accounts.deleteConfirmDescription', { name: accountToDelete?.name })}
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
