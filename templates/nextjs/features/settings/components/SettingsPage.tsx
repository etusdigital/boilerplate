'use client'

import { TitleBar } from '@boilerplate/ui-react'
import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <TitleBar title={t('settings.title')} />

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.general')}</h2>
        <p className="text-muted-foreground">
          {t('settings.description')}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.account')}</h2>
        <p className="text-muted-foreground">
          Account settings will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.notifications')}</h2>
        <p className="text-muted-foreground">
          Notification preferences will be displayed here.
        </p>
      </div>
    </div>
  )
}
