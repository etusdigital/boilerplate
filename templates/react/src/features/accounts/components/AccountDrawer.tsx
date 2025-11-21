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
import { Account } from '../types/account.type'

interface AccountDrawerProps {
  open: boolean
  account: Account | null
  onClose: () => void
  onSave: (account: Partial<Account>) => Promise<void>
}

export function AccountDrawer({ open, account, onClose, onSave }: AccountDrawerProps) {
  const { t } = useTranslation()
  const isEditing = !!account?.id

  // Define Zod schema for validation
  const accountSchema = z.object({
    name: z.string().min(1, t('accounts.validation.name')),
    slug: z
      .string()
      .min(1, t('accounts.validation.slug'))
      .regex(/^[a-z0-9-]+$/, t('accounts.validation.slugFormat')),
  })

  type AccountFormData = z.infer<typeof accountSchema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  // Reset form when account prop changes
  useEffect(() => {
    if (account) {
      reset({
        name: account.name || '',
        slug: account.slug || '',
      })
    } else {
      reset({
        name: '',
        slug: '',
      })
    }
  }, [account, reset])

  const onSubmit = async (data: AccountFormData) => {
    try {
      const accountData: Partial<Account> = {
        ...data,
      }

      if (isEditing && account?.id) {
        accountData.id = account.id
      }

      await onSave(accountData)
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to save account:', error)
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
              {isEditing ? t('accounts.editAccount') : t('accounts.inviteAccount')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-6">
            {/* Account Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('accounts.name')} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('accounts.name')}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Account Slug/Domain Field */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                {t('accounts.slug')} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder={t('accounts.slug')}
                disabled={isSubmitting}
              />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500">{t('accounts.slugHint')}</p>
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
