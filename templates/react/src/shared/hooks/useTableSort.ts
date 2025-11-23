import { useState, useCallback } from 'react'

export interface SortConfig<T extends string = string> {
  sortBy: T
  sortOrder: 'ASC' | 'DESC'
}

export function useTableSort<T extends string>(
  initialColumn: T,
  initialOrder: 'ASC' | 'DESC' = 'ASC'
) {
  const [sortBy, setSortBy] = useState<T>(initialColumn)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(initialOrder)

  const handleSortChange = useCallback(
    (column: T) => {
      if (sortBy === column) {
        // Toggle sort order if same column
        setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
      } else {
        // Set new column and default to ASC
        setSortBy(column)
        setSortOrder('ASC')
      }
    },
    [sortBy, sortOrder]
  )

  const getSortIcon = useCallback(
    (column: T): string => {
      if (sortBy !== column) return 'unfold_more'
      return sortOrder === 'ASC' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
    },
    [sortBy, sortOrder]
  )

  return {
    sortBy,
    sortOrder,
    handleSortChange,
    getSortIcon,
  }
}
