import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Skeleton,
  SortableTableHead,
  TablePagination,
} from '@boilerplate/ui-react'
import { User, PaginationMeta } from '../types/user.type'

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  pagination: PaginationMeta
  sortBy: string
  sortOrder: 'ASC' | 'DESC'
  getSortIcon: (column: string) => string
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  onSortChange: (column: string) => void
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  sortBy,
  sortOrder,
  getSortIcon,
  onEdit,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
  onSortChange,
}: UsersTableProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
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

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p>{t('users.noUsers')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label={t('table.name')}
              column="name"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('name')}
              onSort={onSortChange}
              className="w-[50%]"
            />
            <SortableTableHead
              label={t('table.email')}
              column="email"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('email')}
              onSort={onSortChange}
            />
            <SortableTableHead
              label={t('table.updatedAt')}
              column="updatedAt"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('updatedAt')}
              onSort={onSortChange}
            />
            <SortableTableHead
              label={t('table.deletedAt')}
              column="deletedAt"
              currentSortColumn={sortBy}
              sortIcon={getSortIcon('deletedAt')}
              onSort={onSortChange}
            />
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="w-[50%] text-primary font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{formatDate(user.updatedAt)}</span>
                  {user.createdAt && (
                    <span className="text-xs">
                      {t('table.createdAt')} {formatDate(user.createdAt)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(user.deletedAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <span className="material-symbols-rounded">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
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
          colSpan={5}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </Table>
    </div>
  )
}
