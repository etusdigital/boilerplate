'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function CallbackPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">⏳</div>
        <p className="text-lg">Authenticating...</p>
      </div>
    </div>
  )
}
