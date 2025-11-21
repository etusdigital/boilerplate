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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, PaginationMeta } from '../types/user.type'

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  pagination: PaginationMeta
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
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
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>{t('users.noUsers')}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.email')}</TableHead>
            <TableHead>{t('table.updatedAt')}</TableHead>
            <TableHead>{t('table.deletedAt')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{formatDate(user.updatedAt)}</span>
                  {user.createdAt && (
                    <span className="text-xs text-gray-500">
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t('table.itemsPerPage')}:</span>
          <Select
            value={String(pagination.limit)}
            onValueChange={(value) => onItemsPerPageChange?.(Number(value))}
          >
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.currentPage === 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              <span className="material-symbols-rounded text-[20px]">chevron_left</span>
            </Button>
            <div className="flex items-center justify-center min-w-[32px] text-sm">
              {pagination.currentPage}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              <span className="material-symbols-rounded text-[20px]">chevron_right</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
