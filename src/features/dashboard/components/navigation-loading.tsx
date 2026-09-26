'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import logoImg from '@/assets/duora-logo3.png'

export default function NavigationLoading() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
       if (event.defaultPrevented) return
      const target = event.target as HTMLElement
      const link = target.closest('a')

      if (!link) return

      const href = link.getAttribute('href')

      if (!href) return
      if (href.startsWith('#')) return
      if (href.startsWith('http')) return
      if (href.startsWith('mailto:')) return
      if (href.startsWith('tel:')) return
      if (link.target === '_blank') return

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const currentUrl =
        window.location.pathname + window.location.search

      if (href === currentUrl) return

      setLoading(true)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 md:left-64">
      <div className="flex h-dvh w-full items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border border-neutral-200 border-t-neutral-900" />

            <div className="absolute inset-[5px] rounded-full border border-neutral-100" />

            <Image
              src={logoImg}
              width={34}
              height={34}
              alt="Duora"
              className="relative object-contain opacity-40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}