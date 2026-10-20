'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  decoration?: ReactNode
}

export default function Modal({ open, onClose, label, children, decoration }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center p-4">
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm animate-modal-in">
        <div className="max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/[0.08] bg-primary shadow-2xl">{children}</div>

        {decoration}

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-subprimary text-description transition hover:text-secondary"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body,
  )
}