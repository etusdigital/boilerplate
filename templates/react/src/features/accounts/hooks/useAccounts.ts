import { useState, useCallback } from 'react'
import { accountsApi } from '../api/accountsApi'
import { Account, AccountsQueryParams, PaginationMeta } from '../types/account.type'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  const fetchAccounts = useCallback(async (params: AccountsQueryParams) => {
    setIsLoading(true)
    try {
      const response = await accountsApi.list(params)
      setAccounts(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createAccount = useCallback(async (account: Partial<Account>) => {
    try {
      await accountsApi.create(account)
    } catch (error) {
      console.error('Failed to create account:', error)
      throw error
    }
  }, [])

  const updateAccount = useCallback(async (id: string, account: Partial<Account>) => {
    try {
      await accountsApi.update(id, account)
    } catch (error) {
      console.error('Failed to update account:', error)
      throw error
    }
  }, [])

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await accountsApi.delete(id)
    } catch (error) {
      console.error('Failed to delete account:', error)
      throw error
    }
  }, [])

  return {
    accounts,
    isLoading,
    pagination,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}
