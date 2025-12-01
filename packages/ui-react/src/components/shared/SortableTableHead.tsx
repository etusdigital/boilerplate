import { TableHead } from '../ui/table'

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
  const isActive = currentSortColumn === column

  return (
    <TableHead className={`p-0 ${className || ''}`}>
      <button
        onClick={() => onSort(column)}
        className={`
          flex items-center gap-1
          w-full h-full
          py-sm
          text-left
          transition-all duration-200
          active:bg-accent/80
        `}
      >
        {label}
        <span className="material-symbols-rounded text-lg">{sortIcon}</span>
      </button>
    </TableHead>
  )
}
