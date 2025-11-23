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
  const isActive = currentSortColumn === column

  return (
    <TableHead className={`p-0 ${className || ''}`}>
      <button
        onClick={() => onSort(column)}
        className={`
          flex items-center gap-1
          w-full h-full
          px-5 py-4
          text-left
          transition-all duration-200
          hover:bg-gray-100
          active:bg-gray-200
          ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-gray-900'}
        `}
      >
        {label}
        <span className="material-symbols-rounded text-[20px]">
          {sortIcon}
        </span>
      </button>
    </TableHead>
  )
}
