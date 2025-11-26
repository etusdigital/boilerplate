import { redirect } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0'

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <img
            src="/etus-logo.png"
            alt="Logo"
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/api/auth/login"
            className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
