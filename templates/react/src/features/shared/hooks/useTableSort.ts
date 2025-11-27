import { useState, useCallback } from 'react'

export function useTableSort<T extends string>(
  defaultColumn: T,
  defaultOrder: 'ASC' | 'DESC' = 'ASC'
) {
  const [sortBy, setSortBy] = useState<T>(defaultColumn)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(defaultOrder)

  const handleSortChange = useCallback((column: T) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      // Set new column and default to ASC
      setSortBy(column)
      setSortOrder('ASC')
    }
  }, [sortBy, sortOrder])

  const getSortIcon = useCallback((column: string) => {
    if (sortBy !== column) return 'unfold_more'
    return sortOrder === 'ASC' ? 'expand_less' : 'expand_more'
  }, [sortBy, sortOrder])

  return {
    sortBy,
    sortOrder,
    handleSortChange,
    getSortIcon,
  }
}
