import type { Metadata } from 'next'
import './globals.css'

import QueryProvider from '@/providers/query-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://duora-grow-together.vercel.app'),
  title: 'Duora — AI Relationship Companion for Long-Distance Couples',
  description:
    'Duora is an AI relationship companion for long-distance couples. Its AI Assistant knows your goals, check-ins, plans, and notes, so every answer feels personal.',
  openGraph: {
    title: 'Duora — A Personal AI Assistant for Your Long-Distance Relationship',
    description:
      'Ask anything about your relationship and get answers based on your own goals, daily check-ins, plans, and notes. Resolve disagreements with AI Debate, and grow closer with shared goals, Q&A, and more.',
    siteName: 'Duora',
    type: 'website',
  },
  // verification: { google: '...' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}