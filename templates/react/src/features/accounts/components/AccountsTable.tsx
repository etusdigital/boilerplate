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
import { SortableTableHead } from '@/shared/components/SortableTableHead'
import { TablePagination } from '@/shared/components/TablePagination'
import { Account, PaginationMeta } from '../types/account.type'

interface AccountsTableProps {
  accounts: Account[]
  isLoading: boolean
  pagination: PaginationMeta
  sortBy: string
  sortOrder: 'ASC' | 'DESC'
  getSortIcon: (column: string) => string
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
  onPageChange: (page: number) => void
  onSortChange: (column: string) => void
}

export function AccountsTable({
  accounts,
  isLoading,
  pagination,
  sortBy,
  sortOrder,
  getSortIcon,
  onEdit,
  onDelete,
  onPageChange,
  onSortChange,
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
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p>{t('accounts.noAccounts')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label={t('accounts.name')}
              column="name"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('name')}
              onSort={onSortChange}
              className="w-[50%]"
            />
            <SortableTableHead
              label={t('accounts.domain')}
              column="domain"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('domain')}
              onSort={onSortChange}
            />
            <SortableTableHead
              label={t('accounts.createdAt')}
              column="createdAt"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('createdAt')}
              onSort={onSortChange}
            />
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium w-[50%] text-primary">{account.name}</TableCell>
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
                    <span className="material-symbols-rounded text-destructive">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Pagination */}
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.limit}
          colSpan={4}
          onPageChange={onPageChange}
        />
      </Table>
    </div>
  )
}
