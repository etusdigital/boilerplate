import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('notFound.message')}</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
