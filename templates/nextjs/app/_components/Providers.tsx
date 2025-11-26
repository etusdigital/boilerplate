'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@boilerplate/ui-react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../_lib/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <I18nextProvider i18n={i18n}>
        {children}
        <Toaster />
      </I18nextProvider>
    </ThemeProvider>
  )
}
