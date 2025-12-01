import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { TableFooter } from '../ui/table'
import { cn } from '../../lib/utils'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  colSpan: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  colSpan,
  onPageChange,
  onItemsPerPageChange,
}: TablePaginationProps) {
  const { t } = useTranslation()

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5 // Maximum number of page buttons to show

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Calculate showing info
  const showingMin = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const showingMax = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <TableFooter>
      <tr>
        <td colSpan={colSpan} className="px-sm py-sm">
          <div className="flex items-center justify-between">
            {/* Left: Showing info */}
            <div className="text-sm text-muted-foreground">
              {totalItems > 0 ? (
                t('table.showingNofN', {
                  min: showingMin,
                  max: showingMax,
                  total: totalItems,
                })
              ) : (
                t('table.showingNofN', { min: 0, max: 0, total: 0 })
              )}
            </div>

            {/* Center: Items per page */}
            {onItemsPerPageChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('table.itemsPerPage')}:</span>
                <Select value={String(itemsPerPage)} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
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
            )}

            {/* Right: Page navigation */}
            <div className="flex items-center gap-1">
              {/* Previous button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <span className="material-symbols-rounded text-lg">chevron_left</span>
              </Button>

              {/* Page numbers */}
              {pageNumbers.map((page, index) => {
                if (page === '...') {
                  return (
                    <div key={`ellipsis-${index}`} className="flex items-center justify-center min-w-[32px] h-9 text-sm">
                      ...
                    </div>
                  )
                }

                const pageNum = page as number
                const isActive = pageNum === currentPage

                return (
                  <Button
                    key={pageNum}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-9 w-9 text-sm',
                      isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                    )}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              {/* Next button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <span className="material-symbols-rounded text-lg">chevron_right</span>
              </Button>
            </div>
          </div>
        </td>
      </tr>
    </TableFooter>
  )
}
