
// src/components/language-switcher.tsx

'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { setLocale } from '@/i18n/actions'
import { locales } from '@/i18n/config'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const current = useLocale()
  const t = useTranslations('common')
  const [pending, start] = useTransition()

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 ${className}`}
    >
      {locales.map((l) => {
        const active = l === current
        return (
          <button
            key={l}
            type="button"
            disabled={pending}
            aria-pressed={active}
            onClick={() => {
              if (!active) start(() => setLocale(l))
            }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
              active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}