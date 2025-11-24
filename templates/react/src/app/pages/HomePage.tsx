import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-semibold text-gray-800 mb-2">{t('greeting')}</h1>
      <p className="text-base text-gray-600">{t('start_creating')}</p>
    </div>
  )
}

export default HomePage
