import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Account, PaginationMeta } from '../types/account.type'

interface AccountsTableProps {
  accounts: Account[]
  isLoading: boolean
  pagination: PaginationMeta
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
  onPageChange: (page: number) => void
}

export function AccountsTable({
  accounts,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}: AccountsTableProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString(i18n.language)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>{t('accounts.noAccounts')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('accounts.name')}</TableHead>
            <TableHead>{t('accounts.domain')}</TableHead>
            <TableHead>{t('accounts.createdAt')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell>{account.domain || '-'}</TableCell>
              <TableCell>{formatDate(account.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(account)}
                  >
                    <span className="material-symbols-rounded">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(account)}
                  >
                    <span className="material-symbols-rounded text-red-600">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        {pagination.totalItems > 0 && (
          <div className="text-sm text-gray-600">
            {t('table.showingNofN', {
              min: (pagination.currentPage - 1) * pagination.limit + 1,
              max: Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalItems
              ),
              total: pagination.totalItems,
            })}
          </div>
        )}
        {pagination.totalItems === 0 && (
          <div className="text-sm text-gray-600" />
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
