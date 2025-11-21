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
import { User } from '../types/user.type'

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  pagination: PaginationMeta
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onPageChange: (page: number) => void
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}: UsersTableProps) {
  const { t } = useTranslation()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
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
            <TableHead>{t('users.name')}</TableHead>
            <TableHead>{t('users.email')}</TableHead>
            <TableHead>{t('users.updatedAt')}</TableHead>
            <TableHead>{t('users.deletedAt')}</TableHead>
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
                      {t('common.createdAt')} {formatDate(user.createdAt)}
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
                    <span className="material-icons">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                  >
                    <span className="material-icons text-red-600">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {t('table.showingNofN', {
            min: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
            max: Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            ),
            total: pagination.totalItems,
          })}
        </div>
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
