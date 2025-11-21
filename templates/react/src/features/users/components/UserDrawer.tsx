import { useEffect } from 'react'
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
import { User } from '../types/user.type'

interface UserDrawerProps {
  open: boolean
  user: User | null
  onClose: () => void
  onSave: (user: Partial<User>) => Promise<void>
}

export function UserDrawer({ open, user, onClose, onSave }: UserDrawerProps) {
  const { t } = useTranslation()
  const isEditing = !!user?.id

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

  // Reset form when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        isSuperAdmin: user.isSuperAdmin || false,
      })
    } else {
      reset({
        name: '',
        email: '',
        isSuperAdmin: false,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData: Partial<User> = {
        ...data,
      }

      if (isEditing && user?.id) {
        userData.id = user.id
      }

      await onSave(userData)
      reset()
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const handleClose = () => {
    reset()
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
              <Label className="text-base font-semibold">
                {t('users.permissions')}
              </Label>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-600">
                  Dynamic permission management will be implemented here. Users will be able to add/remove account permissions with role selection.
                </p>
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
