import type { Metadata } from 'next'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Providers } from './_components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boilerplate - Next.js',
  description: 'Full-stack boilerplate with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <UserProvider>
          <Providers>
            {children}
          </Providers>
        </UserProvider>
      </body>
    </html>
  )
}
