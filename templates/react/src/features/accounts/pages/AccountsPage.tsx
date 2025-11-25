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
import { AccountsTable } from '../components/AccountsTable'
import { AccountDrawer } from '../components/AccountDrawer'
import { useAccounts } from '../hooks/useAccounts'
import { useTableSort } from '@/shared/hooks/useTableSort'
import { Account } from '../types/account.type'

type AccountSortColumn = 'name' | 'domain' | 'createdAt' | 'updatedAt'

const PAGE_SIZE = 10

export function AccountsPage() {
  const { t } = useTranslation()
  const {
    accounts,
    isLoading,
    pagination,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Use reusable sorting hook
  const { sortBy, sortOrder, handleSortChange, getSortIcon } = useTableSort<AccountSortColumn>('name')

  // Fetch accounts on mount and when search, page, or sorting changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAccounts({
        page: currentPage,
        limit: PAGE_SIZE,
        query: searchQuery,
        sortBy,
        sortOrder
      })
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentPage, sortBy, sortOrder, fetchAccounts])

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // TitleBar actions
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

  // Handle edit account
  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setIsDrawerOpen(true)
  }

  // Handle delete account - open confirmation dialog
  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  // Confirm delete account
  const confirmDelete = async () => {
    if (!accountToDelete) return

    try {
      await deleteAccount(String(accountToDelete.id))
      toast.success(t('accounts.deleteSuccess'))
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
      // Refresh the table
      fetchAccounts({ page: currentPage, limit: PAGE_SIZE, query: searchQuery })
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error(t('accounts.deleteError'))
    }
  }

  // Handle save account (create or update)
  const handleSave = async (accountData: Partial<Account>) => {
    try {
      if (editingAccount && editingAccount.id) {
        // Update existing account
        await updateAccount(String(editingAccount.id), accountData)
        toast.success(t('accounts.updateSuccess'))
      } else {
        // Create new account
        await createAccount(accountData)
        toast.success(t('accounts.createSuccess'))
      }

      setIsDrawerOpen(false)
      setEditingAccount(null)
      // Refresh the table
      fetchAccounts({ page: currentPage, limit: PAGE_SIZE, query: searchQuery })
    } catch (error) {
      console.error('Save account error:', error)
      toast.error(editingAccount ? t('accounts.updateError') : t('accounts.createError'))
      throw error // Re-throw to let the drawer handle it
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

export default AccountsPage
