import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import { Navbar } from '../_components/Navbar'
import { Sidebar } from '../_components/Sidebar'

/**
 * Protected Layout
 *
 * This is a Server Component that:
 * - Checks authentication with getSession() from @auth0/nextjs-auth0
 * - Redirects to /login if not authenticated
 * - Renders Navbar (client component)
 * - Renders Sidebar (client component)
 * - Renders children in main content area
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="h-full bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-base overflow-y-auto">
          <div className="main-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
