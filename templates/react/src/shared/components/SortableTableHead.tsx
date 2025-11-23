import { TableHead } from '@/components/ui/table'

interface SortableTableHeadProps {
  label: string
  column: string
  currentSortColumn: string
  sortIcon: string
  onSort: (column: string) => void
  className?: string
}

export function SortableTableHead({
  label,
  column,
  currentSortColumn,
  sortIcon,
  onSort,
  className,
}: SortableTableHeadProps) {
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        {label}
        <span className="material-symbols-rounded text-[20px]">
          {sortIcon}
        </span>
      </button>
    </TableHead>
  )
}
