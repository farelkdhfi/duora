import type { Metadata } from 'next'
import './globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import QueryProvider from '@/providers/query-provider'
import { TimezoneSync } from '@/i18n/timezone-sync'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')

  return {
    metadataBase: new URL('https://duora-grow-together.vercel.app'),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      siteName: 'Duora',
      type: 'website',
    },
    // verification: { google: '...' },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <TimezoneSync />
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}