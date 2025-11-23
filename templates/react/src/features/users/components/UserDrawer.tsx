import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, UserAccount } from '../types/user.type'
import { Account } from '@/features/accounts/types/account.type'

type RoleType = 'reader' | 'writer' | 'admin'

interface UserPermission {
  accountId: number
  accountName: string
  role: RoleType
}

interface UserDrawerProps {
  open: boolean
  user: User | null
  accounts: Account[]
  onClose: () => void
  onSave: (user: Partial<User>) => Promise<void>
}

export function UserDrawer({ open, user, accounts, onClose, onSave }: UserDrawerProps) {
  const { t } = useTranslation()
  const isEditing = !!user?.id

  // State for managing permissions
  const [permissions, setPermissions] = useState<UserPermission[]>([])

  const roleOptions: { value: RoleType; label: string }[] = [
    { value: 'reader', label: 'Reader' },
    { value: 'writer', label: 'Writer' },
    { value: 'admin', label: 'Admin' },
  ]

  // Define Zod schema for validation
  const userSchema = z.object({
    name: z.string().min(1, t('users.validation.name')),
    email: z.string().email(t('users.validation.email')),
    isSuperAdmin: z.boolean(),
  })

  type UserFormData = z.infer<typeof userSchema>

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      isSuperAdmin: false,
    },
  })

  // Reset form and permissions when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        isSuperAdmin: user.isSuperAdmin || false,
      })

      // Parse user accounts to permissions
      const userPermissions: UserPermission[] = (user.userAccounts || []).map((ua: UserAccount) => ({
        accountId: ua.accountId,
        accountName: ua.account.name,
        role: (ua.role as RoleType) || 'reader',
      }))
      setPermissions(userPermissions)
    } else {
      reset({
        name: '',
        email: '',
        isSuperAdmin: false,
      })
      setPermissions([])
    }
  }, [user, reset])

  // Add permission
  const handleAddPermission = () => {
    if (accounts.length === 0) return

    const firstAccount = accounts[0]
    setPermissions([
      ...permissions,
      {
        accountId: firstAccount.id,
        accountName: firstAccount.name,
        role: 'reader',
      },
    ])
  }

  // Remove permission
  const handleRemovePermission = (index: number) => {
    setPermissions(permissions.filter((_, i) => i !== index))
  }

  // Update permission account
  const handleUpdateAccount = (index: number, accountId: string) => {
    const account = accounts.find((a) => a.id === Number(accountId))
    if (!account) return

    const newPermissions = [...permissions]
    newPermissions[index] = {
      ...newPermissions[index],
      accountId: account.id,
      accountName: account.name,
    }
    setPermissions(newPermissions)
  }

  // Update permission role
  const handleUpdateRole = (index: number, role: RoleType) => {
    const newPermissions = [...permissions]
    newPermissions[index] = {
      ...newPermissions[index],
      role,
    }
    setPermissions(newPermissions)
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData: Partial<User> = {
        ...data,
        userAccounts: permissions.map((p) => ({
          accountId: p.accountId,
          role: p.role,
          account: { name: p.accountName },
        })) as any,
      }

      if (isEditing && user?.id) {
        userData.id = user.id
      }

      await onSave(userData)
      reset()
      setPermissions([])
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const handleClose = () => {
    reset()
    setPermissions([])
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-[40%] sm:max-w-none overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <SheetHeader className="mb-6">
            <SheetTitle>
              {isEditing ? t('users.editUser') : t('users.inviteUser')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('users.name')} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('users.name')}
                disabled={isSubmitting}
                className="border border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {t('users.email')} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('users.email')}
                disabled={isEditing || isSubmitting}
                className="border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Is Super Admin Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSuperAdmin"
                checked={watch('isSuperAdmin')}
                onCheckedChange={(checked) => setValue('isSuperAdmin', checked as boolean)}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="isSuperAdmin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t('users.isSuperAdmin')}
              </Label>
            </div>

            {/* User Permissions per Account Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  {t('users.permissions')}
                </Label>
                <Button
                  type="button"
                  size="icon"
                  variant="default"
                  className="rounded-full h-8 w-8"
                  onClick={handleAddPermission}
                  disabled={isSubmitting}
                >
                  <span className="material-symbols-rounded text-[18px]">add</span>
                </Button>
              </div>

              <div className="space-y-3">
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* Account Select */}
                    <Select
                      value={String(permission.accountId)}
                      onValueChange={(value) => handleUpdateAccount(index, value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={String(account.id)}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Role Select */}
                    <Select
                      value={permission.role}
                      onValueChange={(value) => handleUpdateRole(index, value as RoleType)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemovePermission(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <span className="material-symbols-rounded text-[20px]">delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
