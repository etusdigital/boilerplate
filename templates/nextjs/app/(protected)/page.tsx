'use client'

import { useTranslation } from 'react-i18next'

/**
 * Home Page
 *
 * Simple home page that matches React template's HomePage
 * Displays a welcome message to the user
 */
export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-semibold text-gray-800 mb-2">{t('greeting')}</h1>
      <p className="text-base text-gray-600">{t('start_creating')}</p>
    </div>
  )
}
